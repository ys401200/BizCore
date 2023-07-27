package kr.co.bizcore.v1.svc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import kr.co.bizcore.v1.domain.Schedule;
import kr.co.bizcore.v1.domain.Schedule3;
import kr.co.bizcore.v1.domain.SimpleUser;
import kr.co.bizcore.v1.domain.WorkReport;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ScheduleSvc extends Svc{

    private static final Logger logger = LoggerFactory.getLogger(ScheduleSvc.class);

    // 단일 일정에 대한 조회 메서드
    public Schedule getSchedule(String compId, String type, String no){
        Schedule result = null;
        if(type.equals("sales")){
            logger.info("[ScheduleService.getSchedule] ::::::::: type : " + 1);
            result = scheduleMapper.getScheduleFromSales(compId, no);
        }else if(type.equals("tech")){
            logger.info("[ScheduleService.getSchedule] ::::::::: type : " + 2);
            result = scheduleMapper.getScheduleFromTechd(compId, no);
        }else{
            logger.info("[ScheduleService.getSchedule] ::::::::: type : " + 3);
            result = scheduleMapper.getScheduleFromSched(compId, no);
        }
        logger.info("[ScheduleService.getSchedule] ::::::::: Result is NULL : " + (result == null));
        return result;
    }

    // 단일 일정에 대한 삭제 메서드
    public int deleteSchedule(String compId, String type, String no){
        int result = -1;
        if(type.equals("sales"))        result = scheduleMapper.deleteSales(compId, no);
        else if(type.equals("tech"))    result = scheduleMapper.deleteTechd(compId, no);
        else    result = scheduleMapper.deleteSched(compId, no);
        return result;
    }

    // 단일 일정에 대한 추가 메서드
    public int addSchedule(String compId, Schedule schedule){
        int result = -1;
        String sql = schedule.createInsertQuery(null, compId);
        result = executeSqlQuery(sql);
        return result;
    }

    // 단일 일정에 대한 수정 메서드
    public int modifySchedule(String compId, Schedule3 schedule){
        int result = -1;
        Schedule sch = null;
        sch = getSchedule(compId, schedule.getJob(), schedule.getNo() + "");
        String sql = sch.createUpdateQuery(schedule, null);
        sql += " WHERE ";
        if(schedule.getJob().equals("sales")){
            sql += "salesno=";
        }else if(schedule.getJob().equals("tech")){
            sql += "techdno=";
        }else{
            sql += "schedno=";
        }
        sql += schedule.getNo();
        result = executeSqlQuery(sql);
        return result;
    }

    // ================================= F O R _ C A L E N D A R ===========================

    // 캘린더에서 표시될 1개월치 일정을 전달하는 메서드
    public String getScheduleListForCalendar(String compId, String scope, String deptIn, String userNo, int year, int month){
        String result = null;
        List<Schedule> list1 = null, list2 = null, list3 = null;
        Date start = null, end = null;
        int x = 0;

        start = new Date();
        end = new Date();
        calcStartAndEndDate(year, month, 1, start, end);

        if(scope.equals("dept")){
            list1 = scheduleMapper.getScheduleListFromSalesWithDept(compId, start, end, deptIn);
            list2 = scheduleMapper.getScheduleListFromTechdWithDept(compId, start, end, deptIn);
            list3 = scheduleMapper.getScheduleListFromSchedWithDept(compId, start, end, deptIn);
        }else if(scope.equals("personal")){
            list1 = scheduleMapper.getScheduleListFromSalesWithUser(compId, start, end, userNo);
            list2 = scheduleMapper.getScheduleListFromTechdWithUser(compId, start, end, userNo);
            list3 = scheduleMapper.getScheduleListFromSchedWithUser(compId, start, end, userNo);
        }else{
            list1 = scheduleMapper.getScheduleListFromSched(compId, start, end);
            list2 = scheduleMapper.getScheduleListFromSales(compId, start, end);
            list3 = scheduleMapper.getScheduleListFromTechd(compId, start, end);    
        }

        list1.addAll(list2);
        list1.addAll(list3);
        Collections.sort(list1);

        if(list1 != null){
            result = "[";
            for(x = 0 ; x < list1.size() ; x++){
                if(x > 0)   result += ",";
                result += list1.get(x).toJson();
            }
            result += "]";
        }

        return result;
    } // End of getScheduleList()

    // ===================================== F O R _ W O R K _ R E P O R T =============================

    // 전달받은 날짜가 포함된 주의 일정을 전달하는 메서드
    public String getWorkReport(String compId, String scope, int date, SimpleUser user){
        String result = null;
        int week = -1, year = -1, month = -1, dt = -1, day = -1, x = 0, y = 0;
        String t = null;
        List<WorkReport> reports = null;
        WorkReport report = null;
        List<Schedule3> schedules = null;
        Schedule3 schedule = null;
        Date start = null, end = null;
        Calendar cal = Calendar.getInstance();

        year = date / 10000;
        month = (date % 10000) / 100;
        dt = date % 100;
        t = year + "-" + month + "-" + dt;
        week = year * 100 + systemMapper.getWeekStr(t);

        cal.setTimeInMillis(0);
        cal.set(year, month - 1, dt);
        day = (cal.get(Calendar.DAY_OF_WEEK) - 1) * 86400000;
        start = new Date(cal.getTimeInMillis() - day - 32400000);
        end = new Date(start.getTime() + 86400000 * 7 - 1);
        start = new Date(start.getTime() - 86400000 * 7);

        if(scope.equals("company") || scope.equals("dept")){
            if(scope.equals("dept"))    reports = scheduleMapper.getWorkReportsDept(compId, week, user.getDeptIdSqlIn());
            else    reports = scheduleMapper.getWorkReportsCompany(compId, week);

            if(reports != null && reports.size() > 0)   for(x = 0 ; x < reports.size() ; x++){
                report = reports.get(x);
                schedules = scheduleMapper.getScheduleListForReport(compId, start, end, report.getWriter());
                if(schedules != null && schedules.size() > 0){
                    Collections.sort(schedules);
                    for(y = 0 ; y < schedules.size() ; y++){
                        schedule = schedules.get(y);
                        report.addSchedule(schedule);
                    }
                } 
            }
    
            if(reports != null){
                result = "{\"week\":" + week + ",";
                result += "\"start\":" + start.getTime() + ",";
                result += "\"end\":" + end.getTime() + ",";
                result += "\"workReports\":{";
                for(x = 0 ; x < reports.size() ; x++){
                    report = reports.get(x);
                    if(x > 0)   result += ",";
                    result += ("\"" + report.getWriter() + "\":");
                    result += report.toJson();
                }
                result += "}}";
            }
        }else{
            report = scheduleMapper.getWorkReportPersonal(compId, week, user.getUserNo() + "");
            schedules = scheduleMapper.getScheduleListForReport(compId, start, end, user.getUserNo());
            if(schedules != null)   Collections.sort(schedules);

            //현재 주차 데이터가 없을 경우 지난주의 "차주" 데이터를 가지고 오도록 함"
            if(report != null){
                if(schedules != null && schedules.size() > 0){
                    for(y = 0 ; y < schedules.size() ; y++){
                        schedule = schedules.get(y);
                        report.addSchedule(schedule);
                    }
                } 


                result = "{\"week\":" + week + ",";
                result += "\"start\":" + start.getTime() + ",";
                result += "\"end\":" + end.getTime() + ",";
                result += "\"workReport\":" + report.toJson();
                result += "}";
            }else{
                week = year * 100 + systemMapper.getWeek(new Date(cal.getTimeInMillis() - 86400000 * 7));
                report = scheduleMapper.getWorkReportPersonal(compId, week, user.getUserNo() + "");
                if(report == null)  report = new WorkReport();
                for(y = 0 ; y < schedules.size() ; y++){
                    schedule = schedules.get(y);
                    report.addSchedule(schedule);
                }
                result = "{\"week\":" + week + ",";
                result += "\"start\":" + start.getTime() + ",";
                result += "\"end\":" + end.getTime() + ",";
                result += "\"workReport\":null,";
                result += "\"previousWeek\":" + report.toJson() + "}";
            }
        }

        return result;
    } // End of getWorkReport()

    // 개인의 주간업무보고를 추가하는 메서드
    public boolean addWorkReport(String compId, String userNo, int date, String previousWeek, boolean previousWeekCheck, String currentWeek, boolean currentWeekCheck, ArrayList<String[]> checked){
        boolean result = false;
        int week = -1, y = -1, m = -1, d = -1, x = 0;
        Calendar cal = Calendar.getInstance();
        String sql = null, str1 = null, str2 = null;
        String[] item = null;

        y = date / 10000;
        m = (date % 10000) / 100;
        d = date % 100;
        cal.setTimeInMillis(0);
        cal.set(y, m - 1, d);
        week = y * 100 + systemMapper.getWeek(new Date(cal.getTimeInMillis()));

        sql = "INSERT INTO swc_sreport(";
        str1 = "userno,compno,weeknum,attrib,regdate,prcomment,prcheck,thcomment,thcheck";
        str2 = userNo + ",(SELECT compno FROM swc_company WHERE compid = '" + compId + "')," + week + ",11111,now()";

        if(previousWeek == null){
            str2 += (",''," + (previousWeekCheck ? 1 : 0));
        }else{
            str2 += (",'" + previousWeek + "'," + (previousWeekCheck ? 1 : 0));
        }

        if(currentWeek == null){
            str2 += (",''," + (currentWeekCheck ? 1 : 0));
        }else{
            str2 += (",'" + currentWeek + "'," + (currentWeekCheck ? 1 : 0));
        }

        sql = sql + str1 + ") VALUES(" + str2 + ")";
        deleteWorkReport(compId, userNo, date);
        result = executeSqlQuery(sql) > 0;

        if(checked != null) for(x = 0 ; x < checked.size() ; x++){
            item = checked.get(x);
            if(item[0].equals("sales"))     scheduleMapper.setWorkReportCheckStatusForSales(compId, item[1], userNo, strToInt(item[2]));
            else if(item[0].equals("tech")) scheduleMapper.setWorkReportCheckStatusForTechd(compId, item[1], userNo, strToInt(item[2]));
            else    scheduleMapper.setWorkReportCheckStatusForSched(compId, item[1], userNo, strToInt(item[2]));
        }

        return result;
    }

    // 주간 업무보고를 삭제하는 메서드
    public boolean deleteWorkReport(String compId, String userNo, int date){
        boolean result = false;
        int week = -1, y = -1, m = -1, d = -1;
        Date dt = null;
        Calendar cal = Calendar.getInstance();

        y = date / 10000;
        m = (date % 10000) / 100;
        d = date % 100;
        cal.setTimeInMillis(0);
        cal.set(y, m - 1, d);
        week = systemMapper.getWeek(new Date(cal.getTimeInMillis()));
        result = scheduleMapper.deleteWorkReport(compId, userNo, week) > 0;

        return result;
    }

    // SOPP 번호를 받아서 연관 일정을 전달하는 메서드
    public String getScheduleRelatedSopp(String compId, int soppNo) {
        String result = "[";
        List<Schedule> list1 = null, list2 = null, list3 = null;
        int x = 0;

        //list1 = scheduleMapper.getScheduleFromSched(compId, soppNo);
        //list2 = scheduleMapper.getScheduleListForSoppFromSales(compId, soppNo);
        //list3 = scheduleMapper.getScheduleListForSoppFromTechd(compId, soppNo);

        list1.addAll(list2);
        list1.addAll(list3);
        Collections.sort(list1);

        result = "[";
        for(x = 0 ; x < list1.size() ; x++){
            if(x > 0)   result += ",";
            result += list1.get(x).toJson();
        }
        result += "]";

        return result;
    }

    // 기슬지원에 대한 상세 일정을 가져오는 메서드
    public String getTechDetil(String compId, int sopp, int customer, int contract) {
        String result = null, t = null;
        String sql = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        sql = "SELECT 'tech' AS job, techdNo AS no, userNo AS writer, soppNo AS sopp, IF(endCustNo=100002,NULL,endCustNo) AS customer, CAST(UNIX_TIMESTAMP(techdFrom)*1000 AS CHAR) AS `from`, CAST(UNIX_TIMESTAMP(techdTo)*1000 AS CHAR) AS `to`, techdTitle AS title, techdDesc AS content, techdCheck AS report, techdType AS type, techdPlace AS place, custNo AS partner, contNo AS contract, cntrctMth AS contractMethod, custmemberNo AS cipOfCustomer, techdItemmodel AS supportModel, techdItemversion AS supportVersion, techdSteps AS supportStep, CAST(UNIX_TIMESTAMP(regdatetime)*1000 AS CHAR) AS created, CAST(UNIX_TIMESTAMP(moddatetime)*1000 AS CHAR) AS modified " +
            "FROM swcore2.swc_techd "+
            "WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swcore2.swc_company WHERE compid = '" + compId + "') ";
        if(sopp > 0)        sql += (" AND soppno = " + sopp);
        if(customer > 0)    sql += (" AND custno = " + customer);
        if(contract > 0)    sql += (" AND contno = " + customer);
        sql += " ORDER BY regdatetime DESC";

        try{
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql);
            rs = pstmt.executeQuery();
            while(rs.next()){
                if(result == null)  result = "[";
                else                result += ",";
                t = "{\"job\":\"" + rs.getString(1) + "\",";
                t += ("\"no\":" + rs.getString(2) + ",");
                t += ("\"writer\":" + rs.getString(3) + ",");
                t += ("\"sopp\":" + rs.getString(4) + ",");
                t += ("\"customer\":" + rs.getString(5) + ",");
                t += ("\"from\":" + rs.getString(6) + ",");
                t += ("\"to\":" + rs.getString(7) + ",");
                t += ("\"title\":" + (rs.getString(8) == null ? null : "\"" + rs.getString(8) + "\"") + ",");
                t += ("\"content\":" + (rs.getString(9) == null ? null : "\"" + rs.getString(9).replaceAll("\n", "").replaceAll("\r", "").replaceAll("\t", "").replaceAll("\"", "") + "\"") + ",");
                t += ("\"report\":" + rs.getString(10) + ",");
                t += ("\"type\":" + (rs.getString(11) == null ? null : "\"" + rs.getString(11) + "\"") + ",");
                t += ("\"place\":" + (rs.getString(12) == null ? null : "\"" + rs.getString(12) + "\"") + ",");
                t += ("\"partner\":" + (rs.getString(13) == null ? null : "\"" + rs.getString(13) + "\"") + ",");
                t += ("\"contract\":" + (rs.getString(14) == null ? null : "\"" + rs.getString(14) + "\"") + ",");
                t += ("\"contractMethod\":" + (rs.getString(15) == null ? null : "\"" + rs.getString(15) + "\"") + ",");
                t += ("\"cipOfCustomer\":" + rs.getString(16) + ",");
                t += ("\"supportModel\":" + (rs.getString(17) == null ? null : "\"" + rs.getString(17) + "\"") + ",");
                t += ("\"supportVersion\":" + (rs.getString(18) == null ? null : "\"" + rs.getString(18) + "\"") + ",");
                t += ("\"supportStep\":" + (rs.getString(19) == null ? null : "\"" + rs.getString(19) + "\"") + ",");
                t += ("\"created\":" + rs.getString(20) + ",");
                t += ("\"modified\":" + rs.getString(21) + "}");
                result += t;
            }
            if(result != null)  result += "]";
        }catch(SQLException e){e.printStackTrace();}

        return result;
    }

    // 영업일정에 대한 상세 일정을 가져오는 메서드
    public String getSalesDetil(String compId, int sopp, int customer) {
        String result = null, t = null;
        String sql = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        sql = "SELECT 'sales' AS job, salesNo AS no, userNo AS writer, soppNo AS sopp, ptncNo AS customer, CAST(UNIX_TIMESTAMP(salesFrdatetime)*1000 AS CHAR) AS `from`, CAST(UNIX_TIMESTAMP(salesTodatetime)*1000 AS CHAR) AS `to`, salesTitle AS title, salesDesc AS content, salesCheck AS report, salesType AS type, salesPlace AS place, custNo AS partner, CAST(UNIX_TIMESTAMP(regdatetime)*1000 AS CHAR) AS created, CAST(UNIX_TIMESTAMP(moddatetime)*1000 AS CHAR) AS modified " +
            "FROM swcore2.swc_sales "+
            "WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swcore2.swc_company WHERE compid = '" + compId + "') ";
        if(sopp > 0)        sql += (" AND soppno = " + sopp);
        if(customer > 0)    sql += (" AND (custno = " + customer + " OR ptncno = " + customer + ")");
        sql += " ORDER BY regdatetime DESC";

        try{
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql);
            rs = pstmt.executeQuery();
            while(rs.next()){
                if(result == null)  result = "[";
                else                result += ",";
                t = "{\"job\":\"" + rs.getString(1) + "\",";
                t += ("\"no\":" + rs.getString(2) + ",");
                t += ("\"writer\":" + rs.getString(3) + ",");
                t += ("\"sopp\":" + rs.getString(4) + ",");
                t += ("\"customer\":" + rs.getString(5) + ",");
                t += ("\"from\":" + rs.getString(6) + ",");
                t += ("\"to\":" + rs.getString(7) + ",");
                t += ("\"title\":" + (rs.getString(8) == null ? null : "\"" + rs.getString(8) + "\"") + ",");
                t += ("\"content\":" + (rs.getString(9) == null ? null : "\"" + rs.getString(9).replaceAll("\n", "").replaceAll("\r", "").replaceAll("\t", "") + "\"") + ",");
                t += ("\"report\":" + rs.getString(10) + ",");
                t += ("\"type\":" + (rs.getString(11) == null ? null : "\"" + rs.getString(11) + "\"") + ",");
                t += ("\"place\":" + (rs.getString(12) == null ? null : "\"" + rs.getString(12) + "\"") + ",");
                t += ("\"partner\":" + (rs.getString(13) == null ? null : "\"" + rs.getString(13) + "\"") + ",");
                t += ("\"created\":" + rs.getString(14) + ",");
                t += ("\"modified\":" + rs.getString(15) + "}");
                result += t;
            }
            if(result != null)  result += "]";
        }catch(SQLException e){e.printStackTrace();}

        return result;
    }



    //  FROM swc_sales WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND

    // ======================= 유틸리티 메서드 ===========================

    // int형 시작날짜를 받아서 1달 간격의 시작 및 종료 date를 반환하는 메서드 / start와 end는 반드시 null이 아닌 다른 인스턴스를 넣을 것
    private void calcStartAndEndDate(int y, int m, int d, Date start, Date end){
        Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(0);
        cal.set(y, m - 1, d, 0, 0, 0);
        start.setTime(cal.getTimeInMillis());
        cal.add(Calendar.MONTH, 1);
        end.setTime(cal.getTimeInMillis());
    } // End of calcStartAndEndDate()

    

    
    
}


