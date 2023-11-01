package kr.co.bizcore.v1.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Reference extends Domain {
    private int bf_pk;
    private String bf_Title;
    private String bf_Contents;
    private int userNo;
    private String regDatetime;
    private String bf_delflag;
}
