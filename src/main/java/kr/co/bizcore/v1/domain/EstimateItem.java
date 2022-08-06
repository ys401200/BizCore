package kr.co.bizcore.v1.domain;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class EstimateItem extends Domain{

    private int no;
    private String kind;
    private String title;
    private int customer;
    private int productNo;
    private String productName;
    private String productSpec;
    private int qty;
    private int price;
    private int tax;
    private long amount;
    private int discount;
    private long total;
    private String remark;

    public String toString(){return toJson();}
    
}
