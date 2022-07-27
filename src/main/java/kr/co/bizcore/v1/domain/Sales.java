package kr.co.bizcore.v1.domain;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Sales extends SimpleSales{

    private String detail; //내용
    private String place; //장소
    private String type; //활동형태
    private int chk;
    private int schedType;
    
}
