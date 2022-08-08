package kr.co.bizcore.v1.domain;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class EstimateItem extends Domain{

    protected int no;
    protected String kind;
    protected String title;
    protected int customer;
    protected int productNo;
    protected String productName;
    protected String productSpec;
    protected int qty;
    protected int price;
    protected int tax;
    protected long amount;
    protected int discount;
    protected long total;
    protected String remark;

    public String toString(){return toJson();}
    
}
