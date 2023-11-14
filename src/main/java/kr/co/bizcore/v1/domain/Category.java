package kr.co.bizcore.v1.domain;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class Category extends Domain{
    private int custCategoryNo;
    private int compNo;
    private int userNo;
    private String custCategoryName;
    private String regDatetime;
    private String modDatetime;
    private String attrib;
}
