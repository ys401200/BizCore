package kr.co.bizcore.v1.domain;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class Product extends Domain{

    private int no;
    private String category;
    private int vendor;
    private int writer;
    private String name;
    private String desc;
    private int basePrice;
    private String image;
    private Date created;
    private Date modified;
    
}
