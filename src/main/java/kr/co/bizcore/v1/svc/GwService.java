package kr.co.bizcore.v1.svc;

import java.util.List;

import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.DocForm;

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
    
}
