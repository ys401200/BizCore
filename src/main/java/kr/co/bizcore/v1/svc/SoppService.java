package kr.co.bizcore.v1.svc;

import java.util.List;

import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.SimpleSopp;
import kr.co.bizcore.v1.domain.Sopp;

@Service
public class SoppService extends Svc {

    public String getSoppList(String compId){
        String result = null;
        List<SimpleSopp> list = null;
        int x = 0;

        list = soppMapper.getSoppList(compId);
        if(list != null && list.size() > 0){
            for(x = 0 ; x < list.size() ; x++){
                if(x == 0)  result = "[";
                else        result += ",";
                result += list.get(x).toJson();
            }
            result += "]";
        }

        return result;
    } // End of getSoppList()
    
    public Sopp getSopp(int soppNo, String compId){
        return soppMapper.getSopp(soppNo, compId);
    }
}
