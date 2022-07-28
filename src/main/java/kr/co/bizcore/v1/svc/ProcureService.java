package kr.co.bizcore.v1.svc;

import java.util.List;

import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Procure;

@Service
public class ProcureService extends Svc{

    public String getProcureList(String compId){
        String result = null;
        List<Procure> list = null;
        Procure each = null;
        int x = 0;

        list = procureMapper.getList(compId);
        if(list != null && list.size() > 0) for(x = 0 ; x < list.size() ; x++){
            each = list.get(x);
            if(result == null)  result = "[";
            if(x > 0)   result += ",";
            result += each.toJson();
        }
        if(result != null)  result += "]";

        return result;
    } // End of getProcureList()

    public String getProcure(int no, String compId){
        String result = null;
        Procure each = null;

        each = procureMapper.getProcure(no, compId);
        result = each == null ? null : each.toJson();

        return result;
    } // End of getProcure()
    
}
