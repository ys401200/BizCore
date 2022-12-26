package kr.co.bizcore.v1.svc;

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
    
}