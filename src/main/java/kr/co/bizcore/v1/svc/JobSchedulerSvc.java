package kr.co.bizcore.v1.svc;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.zaxxer.hikari.pool.ProxyPreparedStatement;

import kr.co.bizcore.v1.domain.Sopp2;
import lombok.extern.slf4j.Slf4j;


@Component
@Slf4j
public class JobSchedulerSvc extends Svc{

    private static final Logger logger = LoggerFactory.getLogger(JobSchedulerSvc.class);
    private static int lastWorkDate; // 데일리 작업에 대한 처리 기록
    private static int lastWorkHour; // 매 시간 처리되는 작업에 대한 처리 기록
    private static int lastWorktime;

    @Scheduled(fixedDelay = 60000)
    public void scheduleJob(){

        // 개발 모드에서는 스케줄러 작업을 수행하지 않음
        if(this.DEBUG) return;

        // 초기화 작업

        // 데일리 작업 처리
        if(lastWorkDate < getDate()){
            doDailyJob();
            lastWorkDate = getDate();
            lastWorkHour = -1; // 날짜가 바뀐경우 하단의 hourly 작업에서 시간 비교가 불가하므로 초기화 시켜 줌
        }

        // Hourly 작업 처리
        if(lastWorkHour < getHour()){
            doDailyJob();
            lastWorkHour = getHour();
        }


        // 작업시간 기록
        lastWorktime = getTime();
        System.out.println("[Scheduler] Schedule Job Start : " + getDate() + " " + getTime());

        // 매 스케줄링 마다 실행되는 작업들
        cleanTempFiles(); // 임시파일 정리
        cleanKeepLoginInfo(); // 만료된 로그인 유지정보 삭제
        copyCustomerInfoFromLegacyDB(); // 고객사 정보 자동 복사
        copyTradeInfoFromLegacyDB(); // 매입매출 자료 복사
        copyProcure(); // 조달 정보 복사
        generationSoppFromProcure(); // 조달 정보에서 sopp 생성

        // 스케줄 작업
    } // End of scheduleJob()

    // 데일리 작업
    public void doDailyJob(){
        int count = -01;

        // 퇴사자 처리 / 사임일자를 미래형으로 기록한 지원에 대한 처리
        count = systemMapper.processResignedEmployee();
        logger.info("Do process resigned employee : " + getDate() + " / " + count);

        // 공공데이터 포탈에서 공휴일 정보 가져오기
        processHolidayInfo();
    } // End of doDailyJob()

    // 매 시간 작업
    public void doHourlyJob(){
        
    } // End of doHourlyJob()

    // 임시 폴더의 파일들을 정리하는 메서드
    private void cleanTempFiles(){
        long time = System.currentTimeMillis() - (60000 * 180); // 180분, 3시간
        File root = null;
        int x = 0;

        logger.debug("[Job Scheduler] Start clean temp files");

        root = new File(this.fileStoragePath);
        for(File comp : root.listFiles()){
            if(comp.isDirectory()){
                for(File child : comp.listFiles()){
                    if(child.isDirectory() && child.getName().equals("temp")){
                        for(File temp : child.listFiles()){
                            if(temp.lastModified() < time){
                                logger.debug("[Job Scheduler] Delete temp file [" + getTime() + "]: " + temp.getName());
                                if(temp.delete())   x++;
                            }
                        }
                    }
                }
            }
        }

        logger.debug("[Job Scheduler] Deleted temp files : " + x);

    } // End of cleanTempFiles()

    // 조달정보에 대한 영업기회 자동생성 메서드
    private int generationSoppFromProcure(){
        int result = 0;
        String sql = null;
        Connection conn = null;
        ArrayList<JSONObject> list = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        JSONObject json = null;
        Sopp2 sopp = null;
        String str = null, procure = null;
        Integer customer = null;
        int x = 0, no = 0, r = -1;
        Date dt = null;

        try{
            conn = sqlSession.getConnection();
            list = new ArrayList<>();

            // sopp 등록되지 않은 조달 가져오기
            sql = "SELECT (SELECT no FROM bizcore.customer x WHERE x.name = a.customerName) no, a.id, a.customerCode, a.customerName, a.area, a.`type`, a.reqNo, a.itemCode, a.item, a.price, a.qty, a.unit, a.amount, a.title, a.modQty, a.modAmount, a.contractDate, a.deliveryPlace, a.created FROM bizcore.procure a WHERE a.deleted IS NULL AND a.sopp IS NULL AND a.compid = 'vtek'";
            pstmt = conn.prepareStatement(sql);
            rs = pstmt.executeQuery();
            while(rs.next()){
                json = new JSONObject();
                json.put("no", rs.getInt("no"));
                json.put("id", rs.getInt("id"));
                json.put("customerCode", rs.getString("customerCode"));
                json.put("customerName", rs.getString("customerName"));
                json.put("area", rs.getString("area"));
                json.put("type", rs.getString("type"));
                json.put("reqNo", rs.getString("reqNo"));
                json.put("itemCode", rs.getInt("itemCode"));
                json.put("item", rs.getString("item"));
                json.put("price", rs.getInt("price"));
                json.put("qty", rs.getInt("qty"));
                json.put("unit", rs.getString("unit"));
                json.put("amount", rs.getInt("amount"));
                json.put("title", rs.getString("title"));
                json.put("modQty", rs.getInt("modQty"));
                json.put("modAmount", rs.getInt("modAmount"));
                json.put("contractDate", rs.getDate("contractDate") == null ? 0L : rs.getDate("contractDate").getTime());
                json.put("deliveryPlace", rs.getString("deliveryPlace"));
                json.put("created", rs.getDate("created") == null ? 0L : rs.getDate("created").getTime());
                list.add(json);
            }
            rs.close();
            pstmt.close();

            // 결과가  없으면 종료
            if(list.size() == 0)    return result;

            // 조달을 sopp로 등록
            for(x = 0 ; x < list.size() ; x++){
                json = list.get(x);
                customer = json.getInt("no");
                json.remove("no");
                procure = json.toString();
                no = getNextNumberFromDB("vtek", "bizcore.sopp");
                sopp = new Sopp2();
                sopp.setNo(no);
                sopp.setCustomer(customer);
                sopp.setTitle(json.getString("title"));
                sopp.setExpectedDate(new Date(json.getLong("contractDate")));
                sopp.setExpectedSales(json.getLong("amount"));
                sopp.setCreated(json.getLong("created"));
                sopp.setRelated("{\"parent\":\"project:2\",\"previous\":\"procure:" + json.getInt("id") + "\",\"procure\":" + procure + "}");
                sql = sopp.createInsertQuery("bizcore.sopp", "vtek");
                r = executeSqlQuery(sql);
                if(r > 0){
                    sql = "UPDATE bizcore.procure SET sopp = " + no + " WHERE compId = 'vtek' AND id = " + json.getInt("id");
                    executeSqlQuery(sql);
                    result += r;
                }
            }
        }catch(SQLException e){e.printStackTrace();}
        logger.info("Do process generation sopp from procure : " + getDate() + " / " + result);
        return result;
    } // End of generationSoppFromProcure()

    // 자동수집된 조달 정보를 복사하는 메서드
    private int copyProcure(){
        Integer x = null;
        x = procureMapper.copyProcure();
        return x == null ? 0 : x;
    }

    // 시간이 경과한 로그인 유지 정보를 정리하는 메서드
    private void cleanKeepLoginInfo(){
        systemMapper.deleteKeepToken(System.currentTimeMillis());
    }

    private int getDate(){
        int result = 0;
        Calendar cal = Calendar.getInstance();
        result = cal.get(Calendar.YEAR) * 10000;
        result += (cal.get(Calendar.MONTH) + 1) * 100;
        result += cal.get(Calendar.DATE);
        return result;
    } // End of getDate()

    private int getHour(){return Calendar.getInstance().get(Calendar.HOUR);} // End of getDate()

    private int getTime(){
        int result = 0;
        Calendar cal = Calendar.getInstance();
        result = cal.get(Calendar.HOUR) * 10000;
        result += cal.get(Calendar.MINUTE) * 100;
        result += cal.get(Calendar.SECOND);
        return result;
    } // End of getDate()

    public int copyCustomerInfoFromLegacyDB(){
        int result = -1;
        String sql = "INSERT INTO bizcore.customer(compid, no, name, taxId,email,emailForTaxbill, address, phone, fax, ceoname, related, created) SELECT 'vtek', a.custno, a.custname, IF(a.custvatno='',NULL,a.custvatno), IF(a.custEmail='',NULL,a.custEmail), IF(a.custVatemail='',NULL,a.custVatemail), NULL, NULL, NULL, IF(a.custBossname='',NULL,a.custBossname), '{}', '2022-8-31' FROM swcore.swc_cust a WHERE compno = 100002 AND custno NOT IN (SELECT no FROM bizcore.customer)";
        Connection conn = null;
        PreparedStatement pstmt = null;

        try{
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql);
            result = pstmt.executeUpdate();
        }catch(SQLException e){e.printStackTrace();}
        logger.debug("[Job Scheduler] Copy Customer info : " + result);
        return result;
    } // End of copyCustomerInfoFromLegacyDB()

    public int copyTradeInfoFromLegacyDB(){
        int result = -1;
        String sql = "INSERT INTO bizcore.trade(`no`,compId,dt,belongTo,writer,`type`,product,customer,taxbill,title,qty,price,vat,remark,created) SELECT soppdatano, 'vtek', CAST(regdatetime AS DATE), IF(soppno IS NULL,'',CONCAT('sopp:',soppno)), userno, IF(SUBSTRING(datatype,4)=1,'purchase','sale'), productno, salescustno, vatserial, datatitle, dataquanty, datanetprice, datavat, dataremark, regDatetime FROM swcore.swc_soppdata01 WHERE soppdatano NOT IN (SELECT no FROM bizcore.trade)";
        Connection conn = null;
        PreparedStatement pstmt = null;

        try{
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql);
            result = pstmt.executeUpdate();
        }catch(SQLException e){e.printStackTrace();}
        logger.debug("[Job Scheduler] Copy Trade info : " + result);
        return result;
    }

    // 공휴일 정보를 처리하는 메서드
    private void processHolidayInfo(){
        Calendar cal = Calendar.getInstance();
        int year = -1, month = -1, x = -1, y = -1, z = -1, count = -1, max = 190001;
        String[] each = null;
        ArrayList<String[]> list = new ArrayList<>();
        String str = null;
        String sql1 = "DELETE FROM bizcore.holiday WHERE CONCAT(YEAR(DATE_ADD(now(), INTERVAL 1 MONTH)),'-',MONTH(DATE_ADD(now(), INTERVAL 1 MONTH)),'-',1) <= `date`";
        String sql2 = "SELECT YEAR(z.x)*100+MONTH(z.x) y FROM (SELECT IFNULL(MAX(`date`),CAST('1900-1-1' AS DATE)) x FROM bizcore.holiday) z";
        String sql3 = "INSERT INTO bizcore.holiday(contury, name, `date`, remark) VALUES('ko', ?, CAST(? AS DATE), 'From data.kr By Job scheduler')";
        JSONObject json = null;
        JSONArray jarr = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        year = cal.get(Calendar.YEAR) - 1;
        month = cal.get(Calendar.MONTH);

        try{
            conn = sqlSession.getConnection();

            // 현재월 이후의 공휴일 정보를 삭제처리함
            pstmt = conn.prepareStatement(sql1);
            pstmt.executeUpdate();
            pstmt.close();

            // DB에 저장된 마지막 공휴일의 연월 정보를 가지고 옮
            pstmt = conn.prepareStatement(sql2);
            rs = pstmt.executeQuery();
            if(rs.next())   max = rs.getInt(1);
            rs.close();
            pstmt.close();

            // 1년 전 부터 1년 후까지 25개월에 대해 순회처리하되 현재월까지는 데이터가 있는 경우 건너뜀
            for(count = 0 ; count < 25 ; count++){
                // 월 하나 증가시키기
                month++;
                if(month > 12){
                    month = 1;
                    year++;
                }

                // DB에 저장된 마지막 값과 비교하여 DB에 값이 있는 경우 건너 띔
                if(year*100+month <= max)   continue;

                // 공공데이터에 공휴일 정보를 요청하도록 함
                str = getHolydayFromDataKr(year, month);
                if(str == null || !str.trim().substring(0,1).equals("{")) continue;

                json = new JSONObject(str);
                if(json.isNull("response")) continue;

                json = json.getJSONObject("response");
                if(json.isNull("body")) continue;
                
                json = json.getJSONObject("body");
                // items 에 값이 없을 경우 빈 객체가 아니라 빈 문자열로 저장되어 있는 문제가 있음. 이를 파히기 위해서 count를 확인 후 0 보타 큰 경우 수행하도록 함
                if(json.isNull("items") || json.isNull("totalCount") || json.getInt("totalCount") == 0) continue;
                z = json.getInt("totalCount");

                json = json.getJSONObject("items");
                if(json.isNull("item")) continue;
                
                // item에 하나의 값만 있는 경우 배열리 아닌 그 단일 값이 들이었는 문제가 있음
                if(z == 1){
                    json = json.getJSONObject("item");
                    each = new String[2];
                    each[0] = json.getString("dateName");
                    each[1] = json.getInt("locdate") + "";
                    list.add(each);
                }else{
                    jarr = json.getJSONArray("item");
                    for(x = 0 ; x < jarr.length() ; x++){ // JSONArray 순회하기
                        json = jarr.getJSONObject(x);
                        if(!json.isNull("isHoliday") && !json.isNull("dateName") && !json.isNull("locdate") && json.getString("isHoliday").equals("Y")){
                            each = new String[2];
                            each[0] = json.getString("dateName");
                            each[1] = json.getInt("locdate") + "";
                            list.add(each);
                        }
                    } // End of for(x)
                }
            } // End of for(count);

            // 수집된 공휴일 정보를 DB에 저장
            for(x = 0 ; x < list.size() ; x++){
                each = list.get(x);
                pstmt = conn.prepareStatement(sql3);
                pstmt.setString(1, each[0]);
                pstmt.setString(2, each[1]);
                pstmt.executeUpdate();
            }
        }catch(SQLException e){e.printStackTrace();}
    } // End of processHolidayInfo()
    
    // 공공데이터에서 공휴일 정보를 가져오는 메서드
    private String getHolydayFromDataKr(int year, int month){
        String result = null, line = null, serviceKey = "pLPvMUbq1ZSf6B3nwMFV0mvd6rOMYxX+wmcX7rwwvjlsXnH5v5OvgEu0ikW8Nux5L2RVG+z51wb5KyDsQTvQ2Q==";
        StringBuilder urlBuilder = null, sb = null;
        HttpURLConnection conn = null;
        BufferedReader rd = null;
        URL url = null;
        
        try{
            serviceKey = "pLPvMUbq1ZSf6B3nwMFV0mvd6rOMYxX%2BwmcX7rwwvjlsXnH5v5OvgEu0ikW8Nux5L2RVG%2Bz51wb5KyDsQTvQ2Q%3D%3D";
            urlBuilder = new StringBuilder("http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo"); /*URL*/
            urlBuilder.append("?" + URLEncoder.encode("serviceKey","UTF-8") + "=" + serviceKey); /*Service Key*/
            urlBuilder.append("&" + URLEncoder.encode("_type","UTF-8") + "=" + URLEncoder.encode("json", "UTF-8"));
            urlBuilder.append("&" + URLEncoder.encode("numOfRows","UTF-8") + "=" + URLEncoder.encode("100", "UTF-8"));
            urlBuilder.append("&" + URLEncoder.encode("solYear","UTF-8") + "=" + URLEncoder.encode(year + "", "UTF-8")); /*연*/
            urlBuilder.append("&" + URLEncoder.encode("solMonth","UTF-8") + "=" + URLEncoder.encode((month < 10 ? "0" + month : month+""), "UTF-8")); /*월*/
            
            line = urlBuilder.toString();
            
            url = new URL(line);
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Content-type", "application/json");
            
            if(conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300)  rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            else                                                                rd = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
            
            sb = new StringBuilder();
            while ((line = rd.readLine()) != null)  sb.append(line);

            rd.close();
            conn.disconnect();
            result = sb.toString();
        }catch(IOException e){e.printStackTrace();}
        
        return result;
    } // End of getHolydayFromDataKr()
}
