package kr.co.bizcore.v1.svc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
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

    public String getSchedule(String compId, String userNo, String scope, String value, String from, String to) {
        String result = null, t = null;
        String sql1 = "SELECT no, writer, title, content, report, type, UNIX_TIMESTAMP(`from`)*1000 `from`, UNIX_TIMESTAMP(`to`)*1000 `to`, related, permitted, created, modified FROM bizcore.schedule WHERE deleted IS NULL AND compId = '" + compId + "'";
        String sql2 = "WITH RECURSIVE CTE AS (SELECT deptid, parent FROM bizcore.department WHERE deptid = :deptId AND compId = :compId UNION ALL SELECT p.deptid, p.parent FROM bizcore.department p INNER JOIN CTE ON p.parent = CTE.deptid) SELECT deptid FROM CTE";
        Schedule2 sch = null;
        ArrayList<Schedule2> list = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        int x = 0;

        if(scope.equals("employee"))    sql1 += (" AND writer = " + value);
        else if(scope.equals("dept")){
            
        }



        return result;
    }

    
    
}
