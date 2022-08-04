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
    private Date created;
    private Date modified;
    
}
