package kr.co.bizcore.v1.domain;

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

@Setter @Getter
public class Contract extends SimpleContract{

    private int sopp; //영업기회
    private int prvCont;
    private int employee2; //(부)담당사원
    private int customer; //매출처
    private int cipOfCustomer; //매출처 담당자
    private String detail; //내용
    private int cipOfendUser; //엔드유저 담당자
    private int partner;
    private int cipOfPartner;
    private int supplier;
    private int cipOfSupplier;
    @XmlElement(nillable=true)
    private Date supplied;
    @XmlElement(nillable=true)
    private Date delivered; //검수일자
    @XmlElement(nillable=true)
    private String taxInclude; //vat 포함여부
    @XmlElement(nillable=true)
    private String area;
    @XmlElement(nillable=true)
    private String typeOfBusiness;

    public void setTaxInclude(String yn){taxInclude = yn;}
    public void setTaxInclude(boolean yn){taxInclude = yn ? "Y" : "N";}
    public void setSupplied(Date e){supplied = e;}
    public void setSupplied(long e){supplied = new Date(e);}
    public void setDelivered(Date e){delivered = e;}
    public void setDelivered(long e){delivered = new Date(e);}
    public void setCreated(Date e){created = e;}
    public void setCreated(long e){created = new Date(e);}
    public void setModified(Date e){modified = e;}
    public void setModified(long e){modified = new Date(e);}
    public void setSaleDate(long e){saleDate = new Date(e);}
    public void setSaleDate(Date e){saleDate = e;}

    public String toJson(List<HashMap<String, String>> fileData, List<Schedule> schedules, String trades, List<TaxBill> bills) {
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
            json.put("attached", fileData);
            json.put("schedules", schedules);
            json.put("trades", new JSONArray(trades));
            json.put("bills", bills);
        } catch (JsonProcessingException e) {e.printStackTrace();}
        result = json.toString();
        return result;
    } // End of toJson()
    
}
