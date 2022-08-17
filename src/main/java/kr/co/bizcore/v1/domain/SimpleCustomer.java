package kr.co.bizcore.v1.domain;

import javax.xml.bind.annotation.XmlElement;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SimpleCustomer extends Domain{

    protected int no;
    protected String name;
    @XmlElement(nillable=true)
    protected String businessRegistrationNumber;
    @XmlElement(nillable=true)
    protected String ceoName;
    
}
