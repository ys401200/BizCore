package kr.co.bizcore.v1.domain;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.xml.bind.annotation.XmlElement;

import org.json.JSONArray;
import org.json.JSONObject;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Sopp extends SimpleSopp{
    //=================== 23.09.14 이후 추가 ============================
    private int soppNo;
    private int compNo;
    private int userNo;
    private int custNo;
    private int contNo;
    private int custMemberNo;
    private int ptncNo;
    private int ptncMemberNo;
    private int buyrNo;
    private int buyrMemberNo;
    private int cntrctMth;
    private String soppTitle;
    private String soppDesc;
    private BigDecimal soppTargetAmt;
    private String soppTargetDate;
    private String maintenance_S;
    private String maintenance_E;
    private int soppType;
    private String soppStatus;
    private int soppSrate;
    private int soppSource;
    private String sopp2Desc;
    private String sopp2regDatetime;
    private String businessType;
    private String op_priority;
    private String regDatetime;
    private String modDatetime;
    private String attrib;
    private int productNo;
    private String maintenaceTarget;
    private int secondUserNo;
    private String categories;
    //==================================================================

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
    // private String businessType;
    // @XmlElement(nillable=true)
    private String priority;

    public String toJson(List<HashMap<String, String>> fileData, List<Schedule> schedules, String trades, String estimate) {
        ObjectMapper mapper = new ObjectMapper();
        mapper.setSerializationInclusion(Include.NON_NULL);
        String result = null, t3 = null;
        JSONObject json = null;
        Object obj = null;
        HashMap<String, Object> t1 = null;
        List<HashMap<String, Object>> t2 = new ArrayList<>();
        int x = 0;
        Schedule sch = null;
        TradeDetail tr = null;

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

        t3 = "[";
        if(schedules != null && schedules.size() > 0)   for(x = 0 ; x < schedules.size() ; x++){
            if(x > 0)   t3 += ",";
            sch = schedules.get(x);
            t3 += sch.toJson();
        }
        t3 += "]";

        try {
            result = mapper.writeValueAsString(this);
            json = new JSONObject(result);
            json.put("attached", t2);
            json.put("schedules", new JSONArray(t3));
            json.put("trades", new JSONArray(trades));
            json.put("estimate", new JSONArray(estimate));
        } catch (JsonProcessingException e) {e.printStackTrace();}
        result = json.toString();
        return result;
    } // End of toJson()
    
}