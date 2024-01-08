package kr.co.bizcore.v1.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Store extends Domain{
    private int storeNo;
    private String storeType;
    private int productNo;
    private int compNo;
    private int contNo;
    private int custNo;
    private int userNo;
    private String locationName;
    private String firstDetail;
    private String inventoryQty;
    private int purchaseNet;
    private String serial;
    private String authCode;
    private String options;
    private String secondDetail;
    private String categories;
    private String storeDate;
    private String releaseDate;
    private String orderDate;
    private String bklnDate;
    private String regDate;
    private String modDate;
    private String attrib;

}
