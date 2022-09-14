package kr.co.bizcore.v1.svc;

import java.util.Calendar;
import java.util.List;

import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.DocForm;
import kr.co.bizcore.v1.mapper.GwMapper;

@Service
public class GwService extends Svc{

    public String getForms(){
        String result = null;
        List<DocForm> list = null;
        DocForm form = null;
        int x = 0;

        list = gwFormMapper.getFormList();
        for(x = 0 ; x < list.size() ; x++){
            if(x == 0)  result = "[";
            else        result += ",";
            result += list.get(x).toJson();
        }
        if(result != null)  result += "]";
        return result;
    }

    public String getForm(String docId){
        String result = null;
        DocForm form = null;
        form = gwFormMapper.getForm(docId);
        result = form.toJson();
        return result;
    }

    public int addAppDoc(String compId, String dept, String title, String userNo, String sopp, String customer, String readable, String appDoc, String[] attached, String[][] appLine) {
        int result = -9999;
        int year = -1, x = -1;
        String docNo = null, str = null;

        year = Calendar.getInstance().get(Calendar.YEAR);
        str = dept + "_" + year + "_";
        docNo = str + gwMapper.getNextDocNo(compId, str + "%");
        result = getNextNumberFromDB(compId, "bizcore.doc_app");

        // 문서 헤더정보 DB입력
        if(gwMapper.addNewDocHeader(result, compId, docNo, userNo, dept, title) < 1)    return -10; // 헤더정보 입력 실패

        // 첨부파일에 대한 처리
        
        
        
        
        return 0;
    }
    
}
