package kr.co.bizcore.v1.domain;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class Product extends Domain{

    private int no;
    private String category;
    private String categoryName;
    private int writer;
    private String name;
    private String desc;
    private int price;
    private String image;
    private Date created;
    private Date modified;
    private int vendor;
    
}
