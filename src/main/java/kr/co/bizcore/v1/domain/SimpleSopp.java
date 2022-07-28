package kr.co.bizcore.v1.domain;

import java.util.Date;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SimpleSopp implements Domain{
    private int no; //번호
    private int soppType; //판매방식
    private int contType; //계약구분
    private String title; //영업기회명
    private int customer; //매출처
    private int endUser; //엔드유저
    private int employee; //담당자
    private long expectedSales; //예상매출액
    private String status; //진행단계
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
