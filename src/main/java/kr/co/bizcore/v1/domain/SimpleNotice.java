package kr.co.bizcore.v1.domain;

import java.sql.Date;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SimpleNotice implements Domain {
    private int no;

    private int writer;

    private String title;

    private Date created;
    private Date modified;
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
