package kr.co.bizcore.v1.domain;

import java.math.BigInteger;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class SalesTarget extends Domain{
    private int compNo;
    private int deptNo;
    private int userNo;
    private String targetYear;
    private BigInteger mm01;    
    private BigInteger mm02;
    private BigInteger mm03;
    private BigInteger mm04;
    private BigInteger mm05;
    private BigInteger mm06;
    private BigInteger mm07;
    private BigInteger mm08;
    private BigInteger mm09;
    private BigInteger mm10;
    private BigInteger mm11;
    private BigInteger mm12;
    private String targetType;
    private String regDatetime;
    private String modDatetime;
    private String attrib;
}
