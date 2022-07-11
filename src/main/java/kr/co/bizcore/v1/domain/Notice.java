package kr.co.bizcore.v1.domain;

import java.util.Date;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Notice implements Domain{

    private int no;
    private String compId;
    private int writer;
    private String writerName;
    private String title;
    private String content;
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
    } // End of toJson();
    
}
