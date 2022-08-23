package kr.co.bizcore.v1.domain;

import java.util.Date;

import javax.xml.bind.annotation.XmlElement;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Sched extends Domain{

    @XmlElement(nillable=true)
    private String job;
    private int no;
    private int user;
    private int cust;
    private int sopp;
    @XmlElement(nillable=true)
    private String title;
    @XmlElement(nillable=true)
    private String detail;
    @XmlElement(nillable=true)
    private String place;
    @XmlElement(nillable=true)
    private Date from;
    @XmlElement(nillable=true)
    private Date to;

    public void setFrom(Date v){from = v;}
    public void setFrom(long v){from = new Date(v);}
    public void setTo(Date v){to = v;}
    public void setTo(long v){to = new Date(v);}
    
}
