package kr.co.bizcore.v1.domain;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CustData01 extends Cust {
    private int custdataNo;
    private String custVattype;
    private String custVatbiz;
    private String custVetmemo;
    private String custByear;
    private BigDecimal custCRbalance;
    private BigDecimal custDRbalance;
}
