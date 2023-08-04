package kr.co.bizcore.v1.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter 
@Setter
@ToString
public class Tech extends Domain{
    // 23.06월 이후 추가
    private int techdNo;
    private int no;
    private int compNo;
    private int custNo;
    private int soppNo;
    private int contNo;
    private String cntrctMth;
    private int endCustNo;
    private int custmemberNo;
    private String title;
    private String desc;
    private int techdCheck;
    private int check;
    private String techdItemmodel;
    private String techdItemversion;
    private String techdPlace;
    private String schedFrom;
    private String schedTo;
    private String type;
    private String techdSteps;
    private int userNo;
    private int schedType;
    private String regDatetime;
    private String modDatetime;
    private String attrib;
    private String toDate;
    private String fromDate;
}
