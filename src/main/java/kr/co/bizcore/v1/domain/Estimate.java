package kr.co.bizcore.v1.domain;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class Estimate extends SimpleEstimate{

    protected String type;
    protected int ver;
    protected int sopp;
    protected int discount;
    protected Date created;
    protected Date modified;

    protected String company;
    protected String ceo;
    protected String address;
    protected String phone;
    protected String fax;
    protected int period;
    protected String content;

    private ArrayList<EstimateItem> items = new ArrayList<>();

    public void addItem(EstimateItem item){items.add(item);}
    
}
