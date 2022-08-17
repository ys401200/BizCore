package kr.co.bizcore.v1.domain;

import java.util.Date;

import javax.xml.bind.annotation.XmlElement;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class TradeDetail extends Domain{

    private int no;
    private int sopp;
    private int writer;
    private int category;
    @XmlElement(nillable=true)
    private String product;
    @XmlElement(nillable=true)
    private String customer;
    @XmlElement(nillable=true)
    private String vatSerial;
    @XmlElement(nillable=true)
    private String title;
    @XmlElement(nillable=true)
    private String desc;
    @XmlElement(nillable=true)
    private String type;
    private int quantity;
    private long amount;
    private int discount;
    private long netPrice;
    private int tax;
    private long total;
    @XmlElement(nillable=true)
    private String remark;
    @XmlElement(nillable=true)
    private Date endVataDate;
    
}
