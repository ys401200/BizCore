package kr.co.bizcore.v1.domain;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class DocForm extends Domain{

    private int no;
    private String id;
    private int width;
    private int height;
    private String title;
    private String desc;
    private String form;
    private String defaultJson;
    private String remark;
    
}
