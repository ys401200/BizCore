package kr.co.bizcore.v1.domain;

import java.util.Date;
import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class Trade extends Domain{

    protected int no;
    protected Date dt;
    protected String belongTo;
    protected int writer;
    protected String type;
    protected int product;
    protected int customer;
    protected String taxbill;
    protected String title;
    protected int qty;
    protected long price;
    protected long vat;
    protected String remark;
    protected String pair;
    protected String related;    
    
}
