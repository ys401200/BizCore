package kr.co.bizcore.v1.domain;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Sopp extends SimpleSopp{

    private int contract;
    private String picOfCustomer;
    private int ptnc;
    private int picOfBuyer;
    private String detail;
    private Date targetDate;
    private Date startOfMaintenance;
    private Date endOfMaintenance;
    private int progress;
    private int source;
    private String remark;
    private Date remarkDate;
    private String businessType;
    private String priority;
    
}
