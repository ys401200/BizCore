package kr.co.bizcore.v1.domain;

import java.util.Date;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class SimpleContract implements Domain {
    
    protected int no;
    protected int salesType;
    protected int contractType;
    protected String title;
    protected int buyer;
    protected long contractAmount;
    protected int profit;
    protected int employee;
    protected Date freeMaintenanceStart;
    protected Date freeMaintenanceEnd;
    protected Date saleDate;

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
