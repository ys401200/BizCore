package kr.co.bizcore.v1.domain;

import java.util.Date;

import javax.xml.bind.annotation.XmlElement;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class SimpleTaxBill extends Domain{
    
    protected int no;
    protected boolean type;
    @XmlElement(nillable=true)
    protected Date issueDate;
    @XmlElement(nillable=true)
    protected Date tradeDate;
    @XmlElement(nillable=true)
    protected String regNo;
    @XmlElement(nillable=true)
    protected String sn;
    protected long amount;
    protected long tax;
    @XmlElement(nillable=true)
    protected String product;
    @XmlElement(nillable=true)
    protected String remark;

    public void setType(boolean t){type=t;}
    public void setType(String t){type=t.equals("S");}
    public void setType(byte t){type=t==1;}
    public void setIssueDate(Date d){issueDate=d;}
    public void setIssueDate(long d){issueDate=new Date(d);}
    public void setTradeDate(Date d){tradeDate=d;}
    public void setTradeDate(long d){tradeDate=new Date(d);}
    public String getType(){return type ? "매출" : "매입";}

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
        result += ("\"product\":" + (product == null ? "null" : "\"" + product + "\"") + ",");
        result += ("\"remark\":" + (remark == null ? "null" : "\"" + remark + "\"") + ",");
        result += ("\"created\":" + (created == null ? "null" : created.getTime()) + ",");
        result += ("\"modified\":" + (modified == null ? "null" : modified.getTime()) + "}");
        return result;
    }
    
}