package kr.co.bizcore.v1.domain;

import javax.xml.bind.annotation.XmlElement;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class EstimateItem extends Domain{

    protected int no;
    @XmlElement(nillable=true)
    protected String kind;
    @XmlElement(nillable=true)
    protected String title;
    protected int customer;
    protected int productNo;
    @XmlElement(nillable=true)
    protected String productName;
    @XmlElement(nillable=true)
    protected String productSpec;
    protected int qty;
    protected int price;
    protected int tax;
    protected long amount;
    protected int discount;
    protected long total;
    @XmlElement(nillable=true)
    protected String remark;

    public String toString(){return toJson();}
    
}
