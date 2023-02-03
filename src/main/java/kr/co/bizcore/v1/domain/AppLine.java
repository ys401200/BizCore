package kr.co.bizcore.v1.domain;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppLine {
    private int no;
    private String compId;
    private String docNo; 
    private int employee;
    private int ordered;
    private int appType;
    private Date approved;
    private Date rejected;
    private Date retrieve;
    private String comment ;
    private String attrib;

}
