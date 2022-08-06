package kr.co.bizcore.v1.domain;

import java.util.Date;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Schedule extends Domain{

    private String job;
    private int no;
    private int user;
    private int cust;
    private int sopp;
    private String title;
    private String detail;
    private String place;
    private Date from;
    private Date to;

    public void setFrom(Date v){from = v;}
    public void setFrom(long v){from = new Date(v);}
    public void setTo(Date v){to = v;}
    public void setTo(long v){to = new Date(v);}
    
}
