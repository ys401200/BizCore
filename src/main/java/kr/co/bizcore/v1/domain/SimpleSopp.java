package kr.co.bizcore.v1.domain;

import java.util.Date;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SimpleSopp implements Domain{
    protected int no; //번호
    protected int soppType; //판매방식
    protected int contType; //계약구분
    protected String title; //영업기회명
    protected int customer; //매출처
    protected int endUser; //엔드유저
    protected int employee; //담당자
    protected long expectedSales; //예상매출액
    protected String status; //진행단계
    protected Date created;
    protected Date modified; 

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
