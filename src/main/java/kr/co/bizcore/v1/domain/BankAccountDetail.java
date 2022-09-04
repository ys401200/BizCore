package kr.co.bizcore.v1.domain;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class BankAccountDetail extends Domain{

    private int no;
    private Date date;
    private String briefs;
    private String content;
    private long deposit;
    private long withdraw;
    private long balance;
    private String branch;
    private String remark;
    private String related;
    
}
