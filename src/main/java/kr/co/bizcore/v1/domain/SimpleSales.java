package kr.co.bizcore.v1.domain;

import java.util.Date;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SimpleSales implements Domain{

    protected int no;
    protected String title; //제목
    protected Date from; //활동일 from
    protected Date to; //활동일 to
    protected int sopp; //영업기회
    protected int user; //담당자
    protected int customer; //매출처
    protected int endUser; //엔드유저
    protected Date created;
    protected Date modified;

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
