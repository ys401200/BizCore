package kr.co.bizcore.v1.domain;

import java.sql.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CoporateCardDetail extends Domain {
 
    private int no;
    private String compId; 
    private Date transactionDate;
    private int cardNo;
    private int permitNo;
    private String storeTitle; 
    private int permitAmount;
    private Date created;
    private Date deleted;
    
}
