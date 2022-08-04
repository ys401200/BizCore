package kr.co.bizcore.v1.domain;

import java.sql.Date;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SimpleNotice extends Domain {
    protected int no;
    protected String title;
    protected int writer;
    protected Date created;
    protected Date modified;
}
