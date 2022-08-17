package kr.co.bizcore.v1.domain;

import javax.xml.bind.annotation.XmlElement;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class DocForm extends Domain{

    private int no;
    private String id;
    private int width;
    private int height;
    @XmlElement(nillable=true)
    private String title;
    @XmlElement(nillable=true)
    private String desc;
    @XmlElement(nillable=true)
    private String form;
    @XmlElement(nillable=true)
    private String defaultJson;
    @XmlElement(nillable=true)
    private String remark;
    
}
