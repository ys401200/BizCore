package kr.co.bizcore.v1.domain;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Sales extends SimpleSales{

    private String detail;
    private String place;
    private String type;
    private int chk;
    private int schedType;
    
}
