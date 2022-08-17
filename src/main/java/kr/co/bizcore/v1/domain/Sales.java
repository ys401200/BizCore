package kr.co.bizcore.v1.domain;

import java.util.Date;

import javax.xml.bind.annotation.XmlElement;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Sales extends SimpleSales{

    @XmlElement(nillable=true)
    private String detail; //내용
    @XmlElement(nillable=true)
    private String place; //장소
    @XmlElement(nillable=true)
    private String type; //활동형태
    private int chk;
    private int schedType;
    
}
