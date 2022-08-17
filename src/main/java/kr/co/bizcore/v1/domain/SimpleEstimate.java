package kr.co.bizcore.v1.domain;

import java.util.Date;

import javax.xml.bind.annotation.XmlElement;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class SimpleEstimate extends Domain{

    protected int no;
    @XmlElement(nillable=true)
    protected Date date;
    protected int writer;
    @XmlElement(nillable=true)
    protected String id;
    @XmlElement(nillable=true)
    protected String title;
    protected int customer;
    protected long amount;
    protected int tax;
    protected long total;
    @XmlElement(nillable=true)
    protected String remark; 
    
    public void setDate(Date v){date = v;}
    public void setDate(long v){date = new Date(v);}
    
}
