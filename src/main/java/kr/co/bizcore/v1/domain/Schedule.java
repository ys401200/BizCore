package kr.co.bizcore.v1.domain;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Schedule extends Domain{
    //2023.07.15
    private int no;
    private int schedNo;
    private int userNo;
    private int compNo;
    private int soppNo;
    private int custNo;
    private String schedName;
    private String schedFrom;
    private String schedTo;
    private String title;
    private String desc;
    private int schedCheck;
    private int subschedNo;
    private String schedActive;
    private String schedAllday;
    private String remindflag;
    private int schedType;
    private String schedPlace;
    private String schedColor;
    private String schedCat;
    private int contNo;
    private String regDatetime;
    private String modDatetime;
    private String attrib;
    private String type;
    private String place;
    //2023.07.15
}
