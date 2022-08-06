package kr.co.bizcore.v1.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SimpleNotice extends Domain {
    protected int no;
    protected String title;
    protected int writer;
}
