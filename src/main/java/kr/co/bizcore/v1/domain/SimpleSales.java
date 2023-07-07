package kr.co.bizcore.v1.domain;

import java.util.Date;

import javax.xml.bind.annotation.XmlElement;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SimpleSales extends Domain{

    protected int no;
    protected String title; //제목
    @XmlElement(nillable=true)
    protected Date from; //활동일 from
    @XmlElement(nillable=true)
    protected Date to; //활동일 to
    protected int sopp; //영업기회
    protected int user; //담당자
    protected int customer; //매출처
    protected int endUser; //엔드유저

    // public void setFrom(Date v){from = v;}
    // public void setFrom(long v){from = new Date(v);}
    // public void setTo(Date v){to = v;}
    // public void setTo(long v){to = new Date(v);}
    
}
