package kr.co.bizcore.v1.domain;

import javax.xml.bind.annotation.XmlElement;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter 
@Setter
@ToString
public class Sales extends SimpleSales{

    @XmlElement(nillable=true)
    private String detail; //내용
    @XmlElement(nillable=true)
    private String place; //장소
    @XmlElement(nillable=true)
    private String type; //활동형태
    private int chk;
    
    // 23.06월 이후 추가
    private int salesNo;
    private int soppNo;
    private int userNo;
    private int compNo;
    private int custNo;
    private String schedFrom;
    private String schedTo;
    private String salesPlace;
    private String salesType;
    private String desc;
    private int salesCheck;
    private String title;
    private int ptncNo;
    private String toDate;
    private int schedType;
    private String fromDate;
    private String regDatetime;
    private String modDatetime;
    private String attrib;
}
