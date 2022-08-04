package kr.co.bizcore.v1.domain;

import java.util.Date;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

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

    @Override
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
    }
    
}
