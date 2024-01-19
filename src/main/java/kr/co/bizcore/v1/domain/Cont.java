package kr.co.bizcore.v1.domain;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class Cont extends Domain{
    // 23.06월 이후 추가
    private int contNo;
    private int compNo;
    private int soppNo;
    private String cntrctMth;
    private String contType;
    private int exContNo;
    private int userNo;
    private int contSecondUserNo;
    private int custNo;
    private int custMemberNo;
    private String contTitle;
    private String contDesc;
    private int buyrNo;
    private int buyrMemberNo;
    private int ptncNo;
    private int ptncMemberNo;
    private int supplyNo;
    private int supplyMemberNo;
    private String contOrddate;
    private String supplyDate;
    private String delivDate;
    private BigDecimal contAmt;
    private String vatYn;
    private int net_profit;
    private String freemaintSdate;
    private String freemaintEdate;
    private String paymaintSdate;
    private String paymaintEdate;
    private String contArea;
    private String businessType;
    private String regDatetime;
    private String modDatetime;
    private String attrib;
    private String categories;
    private String maintenanceTarget;
    private String calDateMonth;
    private int calAmtTotal;
    private int getCount;

    private String maintenance_S;
    private String maintenance_E;
}
