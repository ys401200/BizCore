package kr.co.bizcore.v1.domain;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class TaxBill extends SimpleTaxBill{
    private int buyer;
    private int seller;
    private String email;
    private String standard;
    private String issueType;
    
    public String toJson(){
        String result = "{";
        result += ("\"no\":" + no + ",");
        result += ("\"type\":\"" + getType() + "\",");
        result += ("\"issueDate\":" + (issueDate == null ? "null" : issueDate.getTime()) + ",");
        result += ("\"tradeDate\":" + (tradeDate == null ? "null" : tradeDate.getTime()) + ",");
        result += ("\"regNo\":\"" + regNo + "\",");
        result += ("\"sn\":\"" + sn + "\",");
        result += ("\"amount\":" + amount + ",");
        result += ("\"tax\":" + tax + ",");
        result += ("\"product\":\"" + product == null ? "null" : product + "\",");
        result += ("\"remark\":\"" + remark == null ? "null" : remark + "\",");
        result += ("\"buyer\":" + buyer + ",");
        result += ("\"seller\":" + seller + ",");
        result += ("\"email\":\"" + email + "\",");
        result += ("\"standard\":\"" + standard + "\",");
        result += ("\"issueType\":\"" + issueType + "\",");
        result += ("\"created\":" + (created == null ? "null" : created.getTime()) + ",");
        result += ("\"modified\":" + (modified == null ? "null" : modified.getTime()) + "}");
        return result;
    }
    
}
