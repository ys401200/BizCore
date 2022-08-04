package kr.co.bizcore.v1.domain;

import java.util.Date;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Procure extends Domain{

    private int no;
    private String buyerCode;
    private String buyerName;
    private String buyerArea;
    private String buyerAreaCode;
    private String requestNo;
    private String requestItemCode;
    private String requestItem;
    private long itemNetPrice;
    private int itemQty;
    private String itemUnit; 
    private long itemAmount;
    private String title;
    private int modQty;
    private long modAmount; 
    private Date contractDate;
    private Date DeliveryDate;
    private String deliveryPlace;
    private int sopp;
    private Date created;
    private Date modified;
    
}
