package kr.co.bizcore.v1.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SimpleNotice extends Domain {
    protected int no;
    protected String title;
    protected int writer;

    //2023.06.14 이후 추가
    private int noticeNo;
    private int compNo;
    private String noticeTitle;
    private String noticeContents;
    private int userNo;
    private String regDate;
    private String modDate;
    private String attrib;
}
