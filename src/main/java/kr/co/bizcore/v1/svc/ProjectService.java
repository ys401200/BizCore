package kr.co.bizcore.v1.svc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Project;
import kr.co.bizcore.v1.domain.Schedule2;
import kr.co.bizcore.v1.domain.Sopp2;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ProjectService extends Svc{

    private static final Logger logger = LoggerFactory.getLogger(ProjectService.class);

    public String getProjects(String compId){
        String result = null;
        List<Project> list = null;
        Project prj = null;
        int x = 0;

        list = projectMapper.getProjectList(compId);

        result = "[";
        if(list != null && list.size() > 0) for(x = 0 ; x < list.size() ; x++){
            if(x > 0)   result += ",";
            prj = list.get(x);
            result += prj.toJson();
        }
        result += "]";

        return result;
    } // End of getProjects()

    public String getSoppList(String compId){
        String result = null;
        List<Sopp2> list = null;
        Sopp2 sopp = null;
        int x = 0;

        list = projectMapper.getSoppList(compId);

        result = "[";
        if(list != null && list.size() > 0) for(x = 0 ; x < list.size() ; x++){
            if(x > 0)   result += ",";
            sopp = list.get(x);
            result += sopp.toJson();
        }
        result += "]";

        return result;
    } // End of getProjects()

    public int updateProject(String compId, Project prj) {
        int result = -999, no = -999;
        String sql = null;
        Project ogn = null;
        if(prj == null) return result;
        no = prj.getNo();
        if(no == -1){
            no = getNextNumberFromDB(compId, "bizcore.project");
            prj.setNo(no);
            sql = prj.createInsertQuery("bizcore.project", compId);
        }else{
            ogn = projectMapper.getProject(compId, no);
            sql = ogn.createUpdateQuery(prj, "bizcore.project");
            sql += (" WHERE no = " + no + " AND compId = '" + compId + "'");
        }
        result = executeSqlQuery(sql);
        return result;
    } // End of updateProject()

    public String removeProject(String compId, int no) {
        String sql = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        int x = 0;

        try{
            conn = sqlSession.getConnection();

            // 프로젝트가 존재하는지 먼저 검증함
            x = -1;
            sql = "SELECT count(*) FROM bizcore.project WHERE deleted IS NULL AND compId = ? AND NO = ?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, compId);
            pstmt.setInt(2, no);
            rs = pstmt.executeQuery();
            if(rs.next())   x = rs.getInt(1);
            rs.close();
            pstmt.close();
            if(x < 0)   return "an error occurred : step 1";
            else if(x == 0)   return "request project is not exist";

            // 해당 프로젝트가 비어있는지 확인함
            x = -1;
            sql = "SELECT count(*) FROM bizcore.sopp WHERE deleted IS NULL AND compId = ? AND JSON_VALUE(related,'$.parent') = CONCAT('project:',?)";
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, compId);
            pstmt.setInt(2, no);
            rs = pstmt.executeQuery();
            if(rs.next())   x = rs.getInt(1);
            rs.close();
            pstmt.close();
            if(x < 0)   return "an error occurred : step 2";
            else if(x > 0)   return "request project is not empty";

            x = -1;
            sql = "UPDATE bizcore.project SET deleted = now() WHERE deleted IS NULL AND compId = ? AND NO = ?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, compId);
            pstmt.setInt(2, no);
            x = pstmt.executeUpdate();
            rs.close();
            pstmt.close();
            if(x < 0)   return "an error occurred : step 3";
            else if(x == 0)   return "fail to remove project : " + no;
            else return "ok";
        }catch(SQLException e){e.printStackTrace();}
        
        return null;
    } // End of removeProject()

    public String getSopp2(String compId, int no){
        String result = null, chat = null;
        Sopp2 sopp = null;
        Integer prjOwner = null;

        sopp = projectMapper.getSopp(compId, no);
        if(sopp != null){
            prjOwner = projectMapper.getProjectOwnerWithSoppNo(compId, no);
            chat = getSoppChat(compId, no);
            result = "{\"sopp\":" + sopp.toJson() + ",\"projectOwner\":" + prjOwner + ",\"chat\":" + chat + "}";
        }

        return result;
    } // End of getSopp2()

    public Sopp2 updateSopp(String compId, Sopp2 sopp, String userNo) {
        Sopp2 result = null;
        int no = -999, r = -999, x = 0;
        String[] c = {"stage", "title", "desc", "owner", "coWorker", "customer", "partner", "expectedSales", "expectedDate"}, n = {"진행단계", "영업기회명", "설명", "관리자", "담당자", "고객사", "협력사", "예상매출액", "예상매출일"};
        String sql = null, message = null, t = null;
        Sopp2 ogn = null;
        if(sopp == null) return result;
        no = sopp.getNo();
        if(no == -1){
            message = "<영업기회 신규 개설>";
            no = getNextNumberFromDB(compId, "bizcore.sopp");
            sopp.setNo(no);
            sql = sopp.createInsertQuery("bizcore.sopp", compId);
        }else{
            message = "<영업기회 수정 : ";
            ogn = projectMapper.getSopp(compId, no);
            sql = ogn.createUpdateQuery(sopp, "bizcore.sopp");
            logger.error("============================================================  " + sql);
            t = sql.split("VALUES")[0];
            t = t.substring(12);
            sql += (" WHERE no = " + no + " AND compId = '" + compId + "'");
            for(x = 0 ; x < c.length ; x++) if(t.indexOf(c[x]) > 0){
                if(message.length() > 12)   message += ",";
                message += n[x];
            }
            message +=">";
        }
        r = executeSqlQuery(sql);
        if(r > 0){
            addSoppChat(compId, sopp.getNo(), true, strToInt(userNo), sopp.getStage(), message);
            result = projectMapper.getSopp(compId, no);
        }
        return result;
    }

    public int addSoppChat(String compId, int sopp, boolean isNotice, int writer, int stage, String message){
        int idx = -1, r = projectMapper.addSoppChat(compId, sopp, isNotice, writer, stage, message);
        if(r > 0)   idx = projectMapper.getSoppChatIdx(compId, sopp, writer);
        return idx;
    }

    public String getSoppChat(String compId, int soppNo){
        String result = null;
        List<HashMap<String, String>> list = null;
        HashMap<String, String> each = null;
        int x = 0;

        list = projectMapper.getSoppChat(compId, soppNo);
        result = "[";
        if(list != null)    for(x = 0 ; x < list.size() ; x++){
            each = list.get(x);
            if(x > 0)   result += ",";
            result += ("{\"idx\":" + each.get("idx") + ",");
            result += ("\"isNotice\":" + each.get("isNotice") + ",");
            result += ("\"writer\":" + each.get("writer") + ",");
            result += ("\"stage\":" + each.get("stage") + ",");
            result += ("\"message\":\"" + each.get("message") + "\",");
            result += ("\"created\":" + each.get("created") + "}");
        }
        result += "]";

        return result;
    } // End of getSoppChat()

    public int removeSoppChat(String compId, String userNo, int idx) {
        return projectMapper.removeSoppChat(compId, userNo, idx);
    }

    // ================================ S C H E D U L E =========================================

    // 일정 추가,수정 메서드
    public String updateSchedule2(String compId, Schedule2 sch, String userNo){
        String result = null;
        int no = 0;
        String sql = null;
        Schedule2 ogn = null;

        if(sch == null) return "Schedule Data Empty";

        if(sch.getNo() < 0){
            no = getNextNumberFromDB(compId, "bizcore.schedule");
            sch.setNo(no);
            sql = sch.createInsertQuery("bizcore.schedule", compId);
        }else{
            ogn = projectMapper.getSchedule(compId, sch.getNo());
            sql = ogn.createUpdateQuery(sch, "bizcore.schedule");
            sql = sql + " WHERE no = " + sch.getNo();
        }

        logger.error("========================================== " + sql);

        return result;
    } // End of updateSchedule2()
    
}
