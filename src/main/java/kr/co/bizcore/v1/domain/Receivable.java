package kr.co.bizcore.v1.domain;

import javax.xml.bind.annotation.XmlElement;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Receivable extends Domain {

    @XmlElement(nillable = true)
    private String detail; // 내용
    @XmlElement(nillable = true)
    private String place; // 장소
    @XmlElement(nillable = true)
    private String type; // 활동형태
    private int chk;

    // 23.06월 이후 추가
    private int no;
    private int compNo;
    private int custNo;

    private int custBalance;
    private int vatAmountS;
    private int serialTotalS;

    private String vatBuyerName;
    private String vatIssueDateTo;
    private String vatIssueDateFrom;
    private String regDatetime;
    private String modDatetime;
}
