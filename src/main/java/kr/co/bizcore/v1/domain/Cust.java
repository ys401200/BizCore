package kr.co.bizcore.v1.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Cust extends Domain{
    protected int custNo;
    protected int compNo;
    protected int custCompNo;
    protected String custName;
    protected String custVatno;
    protected String custEmail;
    protected String custVatemail;
    protected String custBossname;
    protected String custYn;
    protected String buyrYn;
    protected String ptncYn;
    protected String suppYn;
    protected String saleType;
    protected String compType;
    protected String regDatetime;
    protected String modDatetime;
    protected String attrib;
}
