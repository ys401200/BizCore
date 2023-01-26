package kr.co.bizcore.v1.svc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.DocForm;
import kr.co.bizcore.v1.domain.Schedule2;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class Schedule2Svc extends Svc {

    private static final Logger logger = LoggerFactory.getLogger(Schedule2Svc.class);

    @Autowired
    private GwService gwSvc;

    public String updateSchedule(Schedule2 sch, String compId) {
        String result = null;
        String sql = null, tableName = "bizcore.schedule", formId = null;
        Schedule2 ogn = null;
        DocForm appForm = null;
        int no = 0;

        if(sch.getNo() >= 0){ // 기존 일정
            ogn = schedule2Mapper.getSchedule2(compId, sch.getNo());
            sql = ogn.createUpdateQuery(sch, tableName);
            if(sql != null) sql += (" WHERE compId = '" + compId + "' AND no = " + no);
            no = executeSqlQuery(sql);
            if(no > 0)  result = "success";
        }else{ // 신규 일정
            no = getNextNumberFromDB(compId, tableName);
            sch.setNo(no);
            sql = sch.createInsertQuery(tableName, compId);
            no = executeSqlQuery(sql);
            if(no > 0){ // 일정 추가에 성공한 경우 후속 작업 처리하도록 함
                // ===== 전자결재 / 휴가 또는 연장/휴일근로

                
                // == 연장/휴일근무
                formId = "doc_Form_extension";
                appForm = gwFormMapper.getForm(formId);


                // == 휴가
                formId = "doc_Form_leave";

                // 성공 결과 전달
                result = "success";
            }
        }



        return result;
    } // End of updateSchedule()

    public String getScheduleWithSopp(String compId, String userNo, int sopp) {
        String result = null;
        int x = -999;
        List<Schedule2> list = null;
        
        // 권한이 있는지 확인함
        x = schedule2Mapper.checkPermissionWithSopp(compId, userNo, sopp);
        if(x == 0)  return "permissionDenied";

        // DB에서 일정정보를 가져옴
        result = "[";
        list = schedule2Mapper.getListWithParent(compId, "sopp:" + sopp);
        if(list != null)    for(x = 0 ; x < list.size() ; x++){
            if(x > 0)   result += ",";
            result += list.get(x).toJson();
        }
        result += "]";
        
        return result;
    } // End of getScheduleWithSopp()

    public String getScheduleWithNo(String compId, int no) {
        Schedule2 result = null;
        result = schedule2Mapper.getScheduleWithNo(compId, no);
        return result == null ? null : result.toJson();
    } // End of getScheduleWithNo()

    public String getSchedule(String compId, String userNo, String scope, String value, String from, String to, Integer timeCorrect) {
        String result = null, t = null;
        String sql1 = "SELECT no, writer, title, content, report, type, UNIX_TIMESTAMP(`from`)*1000 `from`, UNIX_TIMESTAMP(`to`)*1000 `to`, related, permitted, UNIX_TIMESTAMP(created)*1000 created, UNIX_TIMESTAMP(modified)*1000 modified FROM bizcore.schedule WHERE deleted IS NULL AND compId = '" + compId + "'";
        String sql2 = "WITH RECURSIVE CTE AS (SELECT deptid, parent FROM bizcore.department WHERE deptid = :deptId AND compId = :compId UNION ALL SELECT p.deptid, p.parent FROM bizcore.department p INNER JOIN CTE ON p.parent = CTE.deptid) SELECT deptid FROM CTE";
        Calendar cal = Calendar.getInstance();
        long dtFrom = 0, dtTo = 0;
        Schedule2 sch = null;
        ArrayList<Schedule2> list = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        int x = 0;
        long tl = 0;

        try{
            conn = sqlSession.getConnection();

            // scope에 따른 writer 설정 / company인 경우 writer 설정 불필요
            if(scope.equals("employee"))    sql1 += (" AND writer = " + (value == null ? userNo : value));
            else if(scope.equals("dept")){
                pstmt = conn.prepareCall(sql2);
                rs = pstmt.executeQuery();
                while(rs.next()){
                    if(t == null)   t = "";
                    else            t += ",";
                    t += ("'" + rs.getString(1) + "'");
                }
                rs.close();
                pstmt.close();
                sql1 += (" AND writer IN (SELECT DISTINCT user_no FROM bizcore.user_dept WHERE dept_id IN (" + t + "))");
            }

            // 검색기간 설정 / 시작 날짜가 있고 종료 날짜가 없는 경우 시작하는 날짜의 달 전체 / 시작 및 종료 날짜가 없는 경우는 1년 전의 달 1일 부터 금월 말일까지
            if(from != null && to != null){
                dtFrom = Long.parseLong(from);
                dtTo = Long.parseLong(to);
            }else if(from != null && to == null){ // 시작 날짜만 있는 경우
                dtFrom = Long.parseLong(from);
                cal.setTimeInMillis(dtFrom);
                cal.set(Calendar.DATE, 1);
                dtFrom = cal.getTimeInMillis();
                cal.set(Calendar.MONTH, cal.get(Calendar.MONTH) + 1);
                dtTo = cal.getTimeInMillis();
            }else{
                cal.set(Calendar.MONTH, cal.get(Calendar.MONTH) + 1);
                cal.set(Calendar.DATE, 1);
                dtTo = cal.getTimeInMillis() + timeCorrect * 60000;
                cal = Calendar.getInstance();
                cal.set(Calendar.YEAR, cal.get(Calendar.YEAR) - 1);
                cal.set(Calendar.DATE, 1);
                dtFrom = cal.getTimeInMillis() + timeCorrect * 60000;
            }
            sql1 += (" AND UNIX_TIMESTAMP(`to`)*1000 > " + dtFrom + " AND UNIX_TIMESTAMP(`from`)*1000 < " + dtTo + " ORDER BY `from`");

            list = new ArrayList<>();
            pstmt = conn.prepareStatement(sql1);
            rs = pstmt.executeQuery();
            while(rs.next()){
                sch = new Schedule2();
                sch.setNo(rs.getInt("no"));
                sch.setWriter(rs.getInt("writer"));
                sch.setTitle(rs.getString("title"));
                sch.setContent(rs.getString("content"));
                sch.setReport(rs.getBoolean("report"));
                sch.setType(rs.getString("type"));
                sch.setFrom(new Date(rs.getLong("from")));
                sch.setTo(new Date(rs.getLong("to")));
                sch.setRelated(rs.getString("related"));
                sch.setPermitted(rs.getByte("permitted"));
                sch.setCreated(rs.getLong("created"));
                sch.setModified(rs.getLong("modified"));
                list.add(sch);
            }
            rs.close();
            pstmt.close();
        }catch(SQLException e){e.printStackTrace();}

        result = "[";
        if(list != null)    for(x = 0 ; x < list.size() ; x++){
            if(x > 0)   result += ",";
            sch = list.get(x);
            result += sch.toJson();
        }
        result += "]";
        return result;
    } // End of getSchedule()

    // 공휴일 정보를 조회/전달하는 메서드
    public String getHoliday(Integer timeCorrect){
        String result = null;
        String contury = "";
        HashMap<String, String> each = null;
        List<HashMap<String, String>> list = null;
        int x = 0;

        if(timeCorrect / 60 == -9) contury = "ko";

        list = schedule2Mapper.getHolidayInfo(contury);
        result = "[";
        for(x = 0 ; x < list.size() ; x++){
            if(x > 0)   result += ",";
            each = list.get(x);
            result += ("[\"" + each.get("dt") + "\",\"" + each.get("name") + "\"]");
        }
        result += "]";

        return result;
    } // End of getHoliday()

    public String getWeeklyReport(String compId, String userNo, String dt, int tc) {
        String result = null;
        String sql1 = "SELECT count(*) FROM bizcore.weekly_report WHERE compId = ? AND dt = ? AND writer = ?";
        String sql2 = "SELECT prv, prvuse, crnt, crntuse FROM bizcore.weekly_report WHERE compId = ? AND dt = ?AND writer = ? ";
        String sql3 = "SELECT crnt, crntUse FROM bizcore.weekly_report WHERE compId = ? AND dt = date_add(?, INTERVAL -7 day) AND writer = ?";
        String sql4 = "SELECT writer, prv, prvuse, crnt, crntuse FROM bizcore.weekly_report WHERE compId = ? AND dt = ? AND writer <> ?";
        String sql5 = "SELECT writer, title, content, report, `from`,  `to` FROM bizcore.schedule WHERE compId = ? AND (report = 1 OR writer = ?) AND `from` <= date_add(date_add(?, INTERVAL ? HOUR), INTERVAL 7 day) AND `to` > date_add(date_add(?, INTERVAL ? HOUR), INTERVAL -7 day) ORDER BY writer, `from`";
        String sql6 = "SELECT z.d, date_add(z.d, INTERVAL -7 day) s, date_add(z.d, INTERVAL 7 day) e FROM (SELECT date_add(?, INTERVAL ? HOUR) d) z";
        String sql = null, writer = null, title = null, report = null, from = null,  to = null, content = null, d = null, s = null, e = null;
        String[] strArr = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        int x = -1;

        try{
            conn = sqlSession.getConnection();

            // 기준 시간 조회
            pstmt = conn.prepareStatement(sql6);
            pstmt.setString(1, dt);
            pstmt.setInt(2, tc);
            rs = pstmt.executeQuery();
            if(rs.next()){
                d = rs.getString(1);
                s = rs.getString(2);
                e = rs.getString(3);
            }
            rs.close();
            pstmt.close();
            d = d == null ? null : "\"" + d.replace(" ", "T") + "Z\"";
            s = s == null ? null : "\"" + s.replace(" ", "T") + "Z\"";
            e = e == null ? null : "\"" + e.replace(" ", "T") + "Z\"";

            // 본인 주간업무보고 존재 여부 확인
            pstmt = conn.prepareStatement(sql1);
            pstmt.setString(1, compId);
            pstmt.setString(2, dt);
            pstmt.setString(3, userNo);
            rs = pstmt.executeQuery();
            if(rs.next())   x = rs.getInt(1);
            rs.close();
            pstmt.close();

            // 본인 주간업무보고 데이터 가져오기 / 안만들어져 있는 경우 지난 주 데이터 가져오기
            strArr = new String[4];
            strArr[0] = "";
            strArr[1] = "1";
            strArr[2] = "";
            strArr[3] = "1";
            if(x > 0)   sql = sql2; // 금주 주간업무보고가 만들어져 있는 경우                
            else        sql = sql3; // 금주 주간업무보고가 만들어져 있지 않은 경우
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, compId);
            pstmt.setString(2, dt);
            pstmt.setString(3, userNo);
            rs = pstmt.executeQuery();
            if(rs.next()){
                strArr[0] = rs.getString(1);
                strArr[1] = rs.getInt(2) + "";
                strArr[2] = x > 0 ? rs.getString(3) : strArr[2];
                strArr[3] = x > 0 ? rs.getInt(4) + "" : strArr[3];
            }
            rs.close();
            pstmt.close();

            // JSON으로 만들기
            result = "{\"date\":" + d + ",\"start\":" + s + ",\"end\":" + e + ",\"report\":{\"" + userNo + "\":{\"prv\":\"" +strArr[0] + "\",\"prvUse\":" +strArr[1].equals("1") + ",\"crnt\":\"" +strArr[2] + "\",\"crntUse\":" +strArr[3].equals("1") + "}"; 

            // 본인 외 다른 직원들 주간업무보고 가져오기
            pstmt = conn.prepareStatement(sql4);
            pstmt.setString(1, compId);
            pstmt.setString(2, dt);
            pstmt.setString(3, userNo);
            rs = pstmt.executeQuery();
            while(rs.next()){
                result += (",\"" + rs.getString(1) + "\":{\"prv\":\"" + rs.getString(2) + "\",\"prvUse\":" + rs.getBoolean(3) + ",\"crnt\":\"" + rs.getString(4) + "\",\"crntUse\":" + rs.getBoolean(5) + "}"); 
            }
            result += "},\"schedule\":[";
            rs.close();
            pstmt.close();

            // 일정 가져오기
            x = 0;
            pstmt = conn.prepareStatement(sql5);
            pstmt.setString(1, compId);
            pstmt.setString(2, userNo);
            pstmt.setString(3, dt);
            pstmt.setInt(4, tc);
            pstmt.setString(5, dt);
            pstmt.setInt(6, tc);
            rs = pstmt.executeQuery();
            while(rs.next()){
                if(x > 0)   result += ",";
                else        x = 1;
                writer = rs.getInt(1) + "";
                title = rs.getString(2);
                content = rs.getString(3);
                report = rs.getBoolean(4) + "";
                from = rs.getString(5);
                to = rs.getString(6);
                from = from == null ? null : from.replace(" ", "T") + "Z";
                to = to == null ? null : to.replace(" ", "T") + "Z";
                result += ("{\"writer\":" + writer + ","); 
                result += ("\"title\":" + (title == null ? "null" : "\"" + title + "\"") + ","); 
                result += ("\"content\":" + (content == null ? "null" : "\"" + content + "\"") + ","); 
                result += ("\"inUse\":" + report + ","); 
                result += ("\"from\":" + (from == null ? "null" : "\"" + from + "\"") + ","); 
                result += ("\"to\":" + (to == null ? "null" : "\"" + to + "\"") + "}"); 
            }
            result += "]}";
            rs.close();
            pstmt.close();
        }catch(SQLException ex){ex.printStackTrace();}

        return result;
    }

    public boolean updateWeeklyReport(String compId, String userNo, String dt, String prv, boolean prvUse, String crnt, boolean crntUse) {
        String sql = null;
        String sql1 = "SELECT no FROM bizcore.weekly_report WHERE compId = ? AND dt = ? AND writer = ?";
        String sql2 = "INSERT INTO bizcore.weekly_report(prv, prvUse, crnt, crntUse, compId, `no`, writer, dt, created) VALUES(?, ?, ?, ?, ?, ?, ?, ?, now())";
        String sql3 = "UPDATE bizcore.weekly_report SET prv = ?, prvUse = ?, crnt = ?, crntUse = ?, modified = now() WHERE compId = ?, `no` = ?, writer = ?, dt = ?";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        int no = -1, x = -01;

        try{
            conn = sqlSession.getConnection();
            pstmt = conn.prepareCall(sql1);
            pstmt.setString(1, compId);
            pstmt.setString(2, dt);
            pstmt.setString(3, userNo);
            rs = pstmt.executeQuery();
            if(rs.next())   no = rs.getInt(1);
            rs.close();
            pstmt.close();

            if(no < 0){
                no = getNextNumberFromDB(compId, "bizcore.weekly_report");
                sql = sql2;
            }else   sql = sql3;

            pstmt = conn.prepareCall(sql);
            pstmt.setString(1, prv);
            pstmt.setBoolean(2, prvUse);
            pstmt.setString(3, crnt);
            pstmt.setBoolean(4, crntUse);
            pstmt.setString(5, compId);
            pstmt.setInt(6, no);
            pstmt.setString(7, userNo);
            pstmt.setString(8, dt);                
            x = pstmt.executeUpdate();
            rs.close();
            pstmt.close();
        }catch(SQLException e){e.printStackTrace();}

        return x > 0;
    }

}
