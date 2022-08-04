package kr.co.bizcore.v1.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SimpleCustomer extends Domain{

    protected int no;
    protected String name;
    protected String businessRegistrationNumber;
    protected String ceoName;
    
}
