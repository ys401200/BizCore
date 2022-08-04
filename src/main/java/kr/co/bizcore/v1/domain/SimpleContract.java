package kr.co.bizcore.v1.domain;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class SimpleContract implements Domain {
    
    protected int no; //번호
    protected int salesType; //판매방식
    protected String contractType; //계약방식
    protected String title; //계약명
    protected int endUser; //엔드유저
    protected long contractAmount; //계약금액
    protected int profit; //매출이익
    protected int employee; //담당자
    @JsonInclude(Include.NON_NULL)
    protected Date startOfFreeMaintenance; //무상유지보수일자 시작일
    @JsonInclude(Include.NON_NULL)
    protected Date endOfFreeMaintenance; //무상유지보수일자 종료일
    @JsonInclude(Include.NON_NULL)
    protected Date startOfPaidMaintenance; //유상유지보수일자 시작일
    @JsonInclude(Include.NON_NULL)
    protected Date endOfPaidMaintenance; //유상유지보수일자 종료일
    @JsonInclude(Include.NON_NULL)
    protected Date saleDate; //발주일자? 판매일자?

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
