package kr.co.bizcore.v1.svc;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Dept;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class DeptService extends Svc {

    private static final Logger logger = LoggerFactory.getLogger(DeptService.class);

    public String getDeptJson(String compId){
        String result = null, name = null;
        Dept root = null;
        HashMap<String, Dept> map = null;
        Object[] keySet = null;

        root = rootDept(compId);
        map = root.getMap();
        result = "{";
        keySet = map.keySet().toArray();
        for(Object key : keySet){
            name = (String)key;
            if(result.length() > 2) result += ",";
            result += ("\"" + name + "\":" + map.get(name).toJsonSingle());
        }
        result += "}";
        
        result = "{\"root\":\"" + root.getDeptId() + "\",\"dept\":" + result + "}";
        return result;
    } // End of getDeptJson()

} // End of Class === DeptService
