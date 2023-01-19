package kr.co.bizcore.v1.domain;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class Maintenance extends Domain {

    private int no;
    private int contract;
    private int customer;
    private int product;
    private String title;
    private Date startDate;
    private Date endDate;
    private int engineer;
    private String coworker;
    private String related;
    private int amount;
    
}
