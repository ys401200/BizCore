package kr.co.bizcore.v1.domain;

import java.sql.Date;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class Maintenance {
    private int no;
    private int contract;
    private int customer;
    private Date start;
    private Date end;
    private int[] engineer;

}
