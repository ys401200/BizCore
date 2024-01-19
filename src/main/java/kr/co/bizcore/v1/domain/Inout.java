package kr.co.bizcore.v1.domain;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class Inout extends Domain{
    private int soppdataNo;
    private int soppNo;
    private int userNo;
    private int catNo;
    private int productNo;
    private int salesCustNo;
    private String vatSerial;
    private String dataTitle;
    private String dataDesc;
    private String dataType;
    private int dataQuanty;
    private BigDecimal dataAmt;
    private float dataDiscount;
    private BigDecimal dataNetprice;
    private BigDecimal dataVat;
    private BigDecimal dataTotal;
    private String dataRemark;
    private String linkType;
    private String linkNo;
    private String issueDate;
    private String vatDate;
    private String endvataDate;
    private String regDatetime;
    private String modDatetime;
    private String attrib;
    private int divisionMonth;
    private int contNo;
    private int inoutNo;
}
