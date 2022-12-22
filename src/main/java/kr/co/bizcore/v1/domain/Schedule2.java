package kr.co.bizcore.v1.domain;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class Schedule2 extends Domain {
    
    private int no;
    private int writer;
    private String title;
    private String content;
    private boolean report;
    private String type;
    private Date from;
    private Date to;
    private String related;
    private Boolean permitted;
    
    
}
