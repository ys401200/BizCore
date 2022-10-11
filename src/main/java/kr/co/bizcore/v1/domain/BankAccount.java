package kr.co.bizcore.v1.domain;

import java.util.Date;
import java.util.HashMap;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class BankAccount extends Domain{
    protected int no;
    protected String bankCode;
    protected String branch;
    protected String account;
    protected String type;
    protected String remark; 
    protected String serial; // 호환성을 위해 당분간만 유지
    protected String depositor;
    protected long balance;
    protected Long limit;
    protected Date updated;    
    protected Date established;    
    
}
/* 
cardNo
compNo
depName
cardSerial
cardDisNum
cardDivision
cardBank
cardStatus
user_card
cardMemo
cardIssueDate
lastUpdTime
regDate
modDate
attrib
*/