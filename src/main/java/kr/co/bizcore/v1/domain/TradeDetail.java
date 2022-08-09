package kr.co.bizcore.v1.domain;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class TradeDetail extends Domain{

    private int no;
    private int sopp;
    private int writer;
    private int category;
    private String product;
    private String customer;
    private String vatSerial;
    private String title;
    private String desc;
    private String type;
    private int quantity;
    private long amount;
    private int discount;
    private long netPrice;
    private int tax;
    private long total;
    private String remark;
    private Date endVataDate;
    
}
