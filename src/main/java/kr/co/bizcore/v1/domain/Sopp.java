package kr.co.bizcore.v1.domain;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Sopp extends SimpleSopp{

    private int contract;
    private String picOfCustomer; //매출처 담당자
    private int ptnc;
    private int picOfBuyer;
    private String detail; //내용
    private Date targetDate; //예상매출예정일
    private Date startOfMaintenance;
    private Date endOfMaintenance;
    private int progress; //가능성
    private int source;
    private String remark;
    private Date remarkDate;
    private String businessType;
    private String priority;
    
}
