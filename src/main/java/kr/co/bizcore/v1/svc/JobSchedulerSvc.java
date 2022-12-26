package kr.co.bizcore.v1.svc;

import java.io.File;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

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
    
    
}
