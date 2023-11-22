package kr.co.bizcore.v1.svc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Sales;
import kr.co.bizcore.v1.domain.Schedule;
import kr.co.bizcore.v1.domain.Schedule2;
import kr.co.bizcore.v1.domain.Tech;
import kr.co.bizcore.v1.mapper.ScheduleMapper;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ScheduleService extends Svc {
    private static final Logger logger = LoggerFactory.getLogger(NoticeSvc.class);
    
    @Autowired
    private ScheduleMapper scheduleMapper;

    public List<Schedule> getList(int compNo) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        LocalDate nowDate = LocalDate.now();
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MONTH, -3);
        String calDate = simpleDateFormat.format(calendar.getTime());
        
        return scheduleMapper.getList(compNo, nowDate.toString(), calDate.toString());
    }

    public List<Schedule> getSearchList(int compNo, String userNo, String soppNo, String custNo, String type, String userDept, String regDatetimeFrom, String regDatetimeTo) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        ArrayList<Schedule> list = null;
        Schedule schedule = null;
        String sql = null;
        String subSql = "";

        try{
            if(userNo != null && userNo != "") subSql += " and schedule.userNo = '" + userNo + "'";
            if(soppNo != null && soppNo != "") subSql += " and schedule.soppNo = '" + soppNo + "'";
            if(custNo != null && custNo != "") subSql += " and schedule.custNo = '" + custNo + "'";
            if(type != null && type != "") subSql += " and schedule.type = '" + type + "'";
            if(userDept != null && userDept != "") subSql += " and swc_user.userDept = '" + userDept + "'";
            if(regDatetimeFrom != null && regDatetimeFrom != "") subSql += " and schedule.regDatetime between '" + regDatetimeFrom + "' and '" + regDatetimeTo + "'";

            sql = "select schedule.salesNo as `no`, schedule.compNo, schedule.custNo, schedule.userNo, schedule.schedFrom, schedule.schedTo, schedule.title as `title`, schedule.desc as `desc`, schedule.salesPlace as place, schedule.schedType, schedule.type as `type`, swc_user.userDept, schedule.regDatetime from swc_sales as schedule left join swc_user on schedule.userNo = swc_user.userNo where schedule.compNo = " + compNo + subSql + " and schedule.attrib not like 'XXX%'" +
            " union " + 
            "select schedule.schedNo as `no`, schedule.compNo as compNo, schedule.custNo, schedule.userNo, schedule.schedFrom, schedule.schedTo, schedule.title as `title`, schedule.desc as `desc`, schedule.schedPlace as place, schedule.schedType, schedule.type as `type`, swc_user.userDept, schedule.regDatetime from swc_sched as schedule left join swc_user on schedule.userNo = swc_user.userNo where schedule.compNo = " + compNo + subSql + " and schedule.attrib not like 'XXX%'" +
            " union " +
            "select schedule.techdNo as `no`, schedule.compNo, schedule.custNo, schedule.userNo, schedule.schedFrom, schedule.schedTo, schedule.title as `title`, schedule.desc as `desc`, schedule.techdPlace as place, schedule.schedType, schedule.type as `type`, swc_user.userDept, schedule.regDatetime from swc_techd as schedule left join swc_user on schedule.userNo = swc_user.userNo where schedule.compNo = " + compNo + subSql + " and schedule.attrib not like 'XXX%'";

            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql);
            rs = pstmt.executeQuery();
            list = new ArrayList<>();
            while(rs.next()){
                schedule = new Schedule();
                schedule.setNo(rs.getInt("no"));
                schedule.setCompNo(rs.getInt("compNo"));
                schedule.setCustNo(rs.getInt("custNo"));
                schedule.setUserNo(rs.getInt("userNo"));
                schedule.setSchedFrom(rs.getString("schedFrom"));
                schedule.setSchedTo(rs.getString("schedTo"));
                schedule.setTitle(rs.getString("title"));
                schedule.setDesc(rs.getString("desc"));
                schedule.setPlace(rs.getString("place"));
                schedule.setSchedType(rs.getInt("schedType"));
                schedule.setType(rs.getString("type"));
                schedule.setUserDept(rs.getString("userDept"));
                schedule.setRegDatetime(rs.getString("regDatetime"));
                list.add(schedule);
            }
            rs.close();
            pstmt.close();
        }catch(SQLException e){e.printStackTrace();}
        
        return list;
    }

    public Schedule getScheduleOne(int compNo, String schedNo){
        return scheduleMapper.getScheduleOne(schedNo, compNo);
    }

    public int insertSchedule(Schedule schedule) {
        return scheduleMapper.scheduleInsert(schedule);
    }

    public int updateSchedule(Schedule schedule) {
        return scheduleMapper.updateSchedule(schedule);
    }
    
    public int delete(int compNo, String schedNo) {
        return scheduleMapper.deleteSchedule(compNo, schedNo);
    }

    public List<Schedule> getWorkReport(String setDate, int userNo, int compNo) {
        Schedule schedule = new Schedule();
        schedule.setFrom(setDate);
        schedule.setUserNo(userNo);
        schedule.setCompNo(compNo);
       return scheduleMapper.getWorkReport(schedule);
    }

    public Schedule getSreport(String weekNum, String userNo, int compNo) {
       return scheduleMapper.getSreport(weekNum, userNo, compNo);
    }

    public int salesReportUpdate(Sales sales) {
        return scheduleMapper.salesReportUpdate(sales);
    }

    public int scheduleReportUpdate(Schedule schedule) {
        return scheduleMapper.scheduleReportUpdate(schedule);
    }

    public int techReportUpdate(Tech tech) {
        return scheduleMapper.techReportUpdate(tech);
    }

    public int reportOtherInsert(Schedule schedule) {
        return scheduleMapper.reportOtherInsert(schedule);
    }

    public List<Schedule> getWorkJournalThisUser(int compNo){
        return scheduleMapper.getWorkJournalThisUser(compNo);
    }

    public List<Schedule> getWorkJournalNextUser(int compNo){
        return scheduleMapper.getWorkJournalNextUser(compNo);
    }
}
