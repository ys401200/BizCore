package kr.co.bizcore.v1.domain;

import java.util.Date;

import javax.xml.bind.annotation.XmlElement;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Procure extends Domain{

    private int no;
    @XmlElement(nillable=true)
    private String buyerCode;
    @XmlElement(nillable=true)
    private String buyerName;
    @XmlElement(nillable=true)
    private String buyerArea;
    @XmlElement(nillable=true)
    private String buyerAreaCode;
    @XmlElement(nillable=true)
    private String requestNo;
    @XmlElement(nillable=true)
    private String requestItemCode;
    @XmlElement(nillable=true)
    private String requestItem;
    @XmlElement(nillable=true)
    private long itemNetPrice;
    @XmlElement(nillable=true)
    private int itemQty;
    @XmlElement(nillable=true)
    private String itemUnit; 
    @XmlElement(nillable=true)
    private long itemAmount;
    @XmlElement(nillable=true)
    private String title;
    @XmlElement(nillable=true)
    private int modQty;
    @XmlElement(nillable=true)
    private long modAmount; 
    @XmlElement(nillable=true)
    private Date contractDate;
    @XmlElement(nillable=true)
    private Date deliveryDate;
    @XmlElement(nillable=true)
    private String deliveryPlace;
    private int sopp;

    public void setContractDate(Date v){contractDate = v;}
    public void setContractDate(long v){contractDate = new Date(v);}
    public void setDeliveryDate(Date v){deliveryDate = v;}
    public void setDeliveryDate(long v){deliveryDate = new Date(v);}
    
}
