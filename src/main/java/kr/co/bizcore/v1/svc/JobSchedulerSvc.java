package kr.co.bizcore.v1.svc;

import java.io.File;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Calendar;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

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
