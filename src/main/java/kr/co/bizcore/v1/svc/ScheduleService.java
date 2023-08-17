package kr.co.bizcore.v1.svc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
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
       return scheduleMapper.getList(compNo);
    }

    public List<Schedule> getSearchList(int compNo, String userNo, String soppNo, String custNo, String type, String regDatetimeFrom, String regDatetimeTo) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        ArrayList<Schedule> list = null;
        Schedule schedule = null;
        String sql = null;
        String subSql = "";

        try{
            if(userNo != null && userNo != "") subSql += " and userNo = '" + userNo + "'";
            if(soppNo != null && soppNo != "") subSql += " and soppNo = '" + soppNo + "'";
            if(custNo != null && custNo != "") subSql += " and custNo = '" + custNo + "'";
            if(type != null && type != "") subSql += " and `type` = '" + type + "'";
            if(regDatetimeFrom != null && regDatetimeFrom != "") subSql += " and regDatetime between '" + regDatetimeFrom + "' and '" + regDatetimeTo + "'";

            sql = "select salesNo as `no`, compNo, custNo, userNo, schedFrom, schedTo, `title`, `desc`, salesPlace as place, schedType, `type`, regDatetime from swc_sales where compNo = " + compNo + subSql + " and attrib not like 'XXX%'" +
            " union " + 
            "select schedNo as `no`, compNo, custNo, userNo, schedFrom, schedTo, `title`, `desc`, schedPlace as place, schedType, `type`, regDatetime from swc_sched where compNo = " + compNo + subSql + " and attrib not like 'XXX%'" +
            " union " +
            "select techdNo as `no`, compNo, custNo, userNo, schedFrom, schedTo, `title`, `desc`, techdPlace as place, schedType, `type`, regDatetime from swc_techd where compNo = " + compNo + subSql + " and attrib not like 'XXX%'";

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

    public List<Schedule> getWorkJournalUser(int compNo){
        return scheduleMapper.getWorkJournalUser(compNo);
    }
}
