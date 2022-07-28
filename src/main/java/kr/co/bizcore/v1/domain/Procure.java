package kr.co.bizcore.v1.domain;

import java.util.Date;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Procure implements Domain{

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

    @Override
    public String toJson() {
        ObjectMapper mapper = new ObjectMapper();
        String result = null;
        try {
            result = mapper.writeValueAsString(this);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return result;
    }
    
}
