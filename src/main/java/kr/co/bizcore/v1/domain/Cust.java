package kr.co.bizcore.v1.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Cust extends Domain{
    private int custNo;
    private int compNo;
    private int custCompNo;
    private String custName;
    private String custVatno;
    private String custEmail;
    private String custVatemail;
    private String custBossname;
    private String custYn;
    private String buyrYn;
    private String ptncYn;
    private String suppYn;
    private String saleType;
    private String compType;
    private String regDatetime;
    private String modDatetime;
    private String attrib;
}
