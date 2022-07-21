package kr.co.bizcore.v1.domain;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttachedFile implements Domain{

    private int idx;
    private int articalNo;
    private String ognName;
    @JsonIgnore
    private String savedName;
    private Date created;
    private Date modified;
    private long size;
    private int removed;

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
