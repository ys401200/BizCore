package kr.co.bizcore.v1.domain;

import java.util.Date;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SimpleSales implements Domain{

    private int no;
    private String title; //제목
    private Date from; //활동일 from
    private Date to; //활동일 to
    private int sopp; //영업기회
    private int user; //담당자
    private int customer; //매출처
    private int endUser; //엔드유저
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
