package kr.co.bizcore.v1.svc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Project;
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
    
}
