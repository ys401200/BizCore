package kr.co.bizcore.v1.domain;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class Customer extends SimpleCustomer{

    private String email;
    private String emailForTaxbill;
    private String address;
    private String phone;
    private String fax;
    private String related;

    public String toJson(){
        String result = "{\"no\":" + no + ",";
        result += ("\"name\":\"" + name + "\",");
        result += ("\"taxId\":" + (taxId == null ? null : "\"" + taxId + "\"") + ",");
        result += ("\"ceoName\":" + (ceoName == null ? null : "\"" + ceoName + "\"") + ",");
        result += ("\"email\":" + (email == null ? null : "\"" + email + "\"") + ",");
        result += ("\"emailForTaxbill\":" + (emailForTaxbill == null ? null : "\"" + emailForTaxbill + "\"") + ",");
        result += ("\"address\":" + (address == null ? null : "\"" + address + "\"") + ",");
        result += ("\"phone\":" + (phone == null ? null : "\"" + phone + "\"") + ",");
        result += ("\"fax\":" + (fax == null ? null : "\"" + fax + "\"") + ",");
        result += ("\"related\":" + related + "}");
        return result;
    }
    
}
