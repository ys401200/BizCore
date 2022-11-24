package kr.co.bizcore.v1.domain;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class Sopp2 extends Domain{
    private int no;
    private int stage;
    private String title;
    private String desc;
    private int owner;
    private String coWorker;
    private int customer;
    private int picOfCustomer;
    private int partner;
    private int picOfPartner;
    private long expactetSales;
    private Date expactedDate;
    private String related;
    private Date closed;
}
