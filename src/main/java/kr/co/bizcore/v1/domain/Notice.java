package kr.co.bizcore.v1.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Notice extends SimpleNotice {

    private String compId;
    private String content;
}
