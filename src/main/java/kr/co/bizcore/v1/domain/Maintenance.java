package kr.co.bizcore.v1.domain;

import java.sql.Date;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class Maintenance extends Domain {

    private int no;
    private int contract;
    private int customer;
    private int product;
    private Date startDate;
    private Date endDate;
    private int engineer;
    private String coworker;
    private Date created;
    private Date modified;
    private Date deleted;
    private String realted;

}
