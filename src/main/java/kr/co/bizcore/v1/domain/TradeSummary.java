package kr.co.bizcore.v1.domain;

import java.util.Date;

import javax.xml.bind.annotation.XmlElement;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class TradeSummary extends Domain{
    private int no;
    @XmlElement(nillable=true)
    private Date date;
    private String title;
    private long purchase;
    private long sales;
    @XmlElement(nillable=true)
    private String remark;
}
