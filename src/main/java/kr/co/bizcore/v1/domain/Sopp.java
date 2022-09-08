package kr.co.bizcore.v1.domain;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.xml.bind.annotation.XmlElement;

import org.json.JSONObject;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Sopp extends SimpleSopp{

    private int contract;
    @XmlElement(nillable=true)
    private String picOfCustomer; //매출처 담당자
    private int ptnc;
    private int picOfBuyer;
    @XmlElement(nillable=true)
    private String detail; //내용
    @XmlElement(nillable=true)
    private Date targetDate; //예상매출예정일
    @XmlElement(nillable=true)
    private Date startOfMaintenance;
    @XmlElement(nillable=true)
    private Date endOfMaintenance;
    private int progress; //가능성
    private int source;
    @XmlElement(nillable=true)
    private String remark;
    @XmlElement(nillable=true)
    private Date remarkDate;
    @XmlElement(nillable=true)
    private String businessType;
    @XmlElement(nillable=true)
    private String priority;

    public String toJson(List<HashMap<String, String>> fileData, List<Schedule> schedules, List<TradeDetail> trades) {
        ObjectMapper mapper = new ObjectMapper();
        mapper.setSerializationInclusion(Include.NON_NULL);
        String result = null;
        JSONObject json = null;
        Object obj = null;
        HashMap<String, Object> t1 = null;
        List<HashMap<String, Object>> t2 = new ArrayList<>();

        if(fileData != null)    for(HashMap<String, String> each : fileData){
            t1 = new HashMap<>();
            t1.put("fileName", each.get("fileName"));
            obj = each.get("size");
            obj = Long.parseLong((String)obj);
            t1.put("size", obj);
            obj = each.get("removed");
            obj = obj == null ? false : obj.equals("1");
            t1.put("removed", obj);
            t2.add(t1);
        }

        try {
            result = mapper.writeValueAsString(this);
            json = new JSONObject(result);
            json.put("attached", t2);
            json.put("schedules", schedules);
            json.put("trades", trades);
        } catch (JsonProcessingException e) {e.printStackTrace();}
        result = json.toString();
        return result;
    } // End of toJson()
    
}