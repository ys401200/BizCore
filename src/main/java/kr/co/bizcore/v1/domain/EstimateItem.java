package kr.co.bizcore.v1.domain;

import java.util.Date;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class EstimateItem implements Domain{

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
    private Date created;
    private Date modified;

    public String toJson() {
        String result = null;
        ObjectMapper mapper = null;

        try {
            mapper = new ObjectMapper();
            result = mapper.writeValueAsString(this);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return result;
    } // End of toJson();

    public String toString(){return toJson();}
    
}
