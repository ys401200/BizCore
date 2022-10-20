package kr.co.bizcore.v1.svc;

import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class EstimateSvc extends Svc{

    private static final Logger logger = LoggerFactory.getLogger(EstimateSvc.class);

    public String getEstimateForms(String compId){
        String result = null, t = null;
        List<HashMap<String, String>> list = null;
        HashMap<String, String> each = null;
        int x = 0;

        list = estimateMapper.getEstimateFormList(compId);
        result = "[";
        if(list != null && list.size() > 0) for(x = 0 ; x < list.size() ; x++){
            each = list.get(x);
            t = "{\"no\":" + each.get("no") + ",";
            t += ("\"name\":\"" + each.get("name") + "\",");
            t += ("\"version\":" + each.get("version") + ",");
            t += ("\"width\":" + each.get("width") + ",");
            t += ("\"height\":" + each.get("height") + ",");
            t += ("\"form\":\"" + each.get("form").replaceAll("\r", "").replaceAll("\n", "").replaceAll("\t", "").replaceAll("\"", "\\\\u0022") + "\",");
            t += ("\"remark\":\"" + each.get("remark") + "\"}");
            if(x > 0)   result += ",";
            result += t;
        }
        result += "]";
        return result;
    } // End of getEstimateForms()

    public String getItems(String compId){
        String result = null, t = null;
        List<HashMap<String, String>> list = null;
        HashMap<String, String> each = null;
        int x = 0;

        list = estimateMapper.getItems(compId);
        result = "[";
        if(list != null && list.size() > 0) for(x = 0 ; x < list.size() ; x++){
            each = list.get(x);
            t = "{\"no\":" + each.get("no") + ",";
            t += ("\"category\":\"" + each.get("category") + "\",");
            t += ("\"supplier\":" + each.get("supplier") + ",");
            t += ("\"product\":\"" + each.get("product") + "\",");
            t += ("\"desc\":\"" + each.get("desc") + "\",");
            t += ("\"price\":" + each.get("price") + "}");
            if(x > 0)   result += ",";
            result += t;
        }
        result += "]";
        return result;
    } // End of getEstimateForms()
    
}
