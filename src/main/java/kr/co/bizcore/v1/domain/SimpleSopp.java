package kr.co.bizcore.v1.domain;

import java.util.Date;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SimpleSopp implements Domain{
    private int no;
    private int soppType;
    private int contType;
    private String title;
    private int customer;
    private int endUser;
    private int employee;
    private long expectedSales;
    private String progress;
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
