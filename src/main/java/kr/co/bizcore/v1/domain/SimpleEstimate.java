package kr.co.bizcore.v1.domain;

import java.util.Date;
import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class SimpleEstimate extends Domain{

    protected int no;
    protected Date date;
    protected int writer;
    protected String id;
    protected String title;
    protected int customer;
    protected long amount;
    protected int tax;
    protected long total;
    protected String remark; 
    
    public void setDate(Date v){date = v;}
    public void setDate(long v){date = new Date(v);}
    
}
