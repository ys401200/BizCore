package kr.co.bizcore.v1.domain;

import java.util.Date;

public class Slip extends Domain{

    private int no;
    private Date date;
    private int account;
    private int customer;
    private String remark;
    private boolean div; // 차대변 구분 / false 차변(debit) , true 대변(credit)
    private String related;
    
}
