package kr.co.bizcore.v1.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SimpleCustomer extends Domain{

    protected int no;
    protected String name;
    protected String taxId;
    protected String ceoName;

    public String toJson(){
        String result = "{\"no\":" + no + ",";
        result += ("\"name\":\"" + name + "\",");
        result += ("\"taxId\":" + (taxId == null ? null : "\"" + taxId + "\"") + ",");
        result += ("\"ceoName\":" + (ceoName == null ? null : "\"" + ceoName + "\"") + "}");
        return result;
    }
    
}
