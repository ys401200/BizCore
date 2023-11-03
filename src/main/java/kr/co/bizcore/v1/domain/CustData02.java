package kr.co.bizcore.v1.domain;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CustData02 extends Cust{
    private int custData02no;
    private int custPostno;
    private String custAddr;
    private String custAddr2;
    private String custTel;
    private String custFax;
    private String custMemo;
}
