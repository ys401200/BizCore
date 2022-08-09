package kr.co.bizcore.v1.domain;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class TradeSummary extends Domain{
    private int no;
    private Date date;
    private String title;
    private long purchase;
    private long sales;
    private String remark;
}
