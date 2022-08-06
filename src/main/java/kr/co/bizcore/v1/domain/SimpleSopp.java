package kr.co.bizcore.v1.domain;

import java.util.Date;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SimpleSopp extends Domain{
    protected int no; //번호
    protected int soppType; //판매방식
    protected int contType; //계약구분
    protected String title; //영업기회명
    protected int customer; //매출처
    protected int endUser; //엔드유저
    protected int employee; //담당자
    protected long expectedSales; //예상매출액
    protected String status; //진행단계
    
}
