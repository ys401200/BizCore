package kr.co.bizcore.v1.domain;

import java.sql.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SimpleNotice {
    private int no;

    private int writer;

    private String title;

    private Date created;
    private Date modified;
}
