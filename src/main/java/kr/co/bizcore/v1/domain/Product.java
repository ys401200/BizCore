package kr.co.bizcore.v1.domain;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class Product extends Domain{
    // ================= 23.09.18 이후 추가 =====================
    private int productNo;
    private int productCategoryNo;
    private String productCategoryName;
    private int compNo;
    private int custNo;
    private int userNo;
    private String productName;
    private String productDesc;
    private int productDefaultPrice;
    private int productImageNo;
    private String regDatetime;
    private String modDatetime;
    private String attrib;
    // =========================================================

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
