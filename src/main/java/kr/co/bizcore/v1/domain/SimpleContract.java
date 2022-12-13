package kr.co.bizcore.v1.domain;

import java.util.Date;
import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class SimpleContract extends Domain {
    
    protected int no; //번호
    protected String title; //계약명
    protected int endUser; //엔드유저
    protected long amount; //계약금액
    protected int profit; //매출이익
    protected int employee; //담당자
    protected Date saleDate; //발주일자? 판매일자?
    protected String related;

}
