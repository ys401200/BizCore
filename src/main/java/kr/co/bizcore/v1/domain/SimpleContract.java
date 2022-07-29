package kr.co.bizcore.v1.domain;

import java.util.Date;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class SimpleContract implements Domain {
    
    private int no;
    private int salesType;
    private int contractType;
    private String title;
    private int buyer;
    private long contractAmount;
    private int profit;
    private int employee;
    private Date maintenanceStart;
    private Date maintenanceEnd;
    private Date saleDate;

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
