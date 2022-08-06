package kr.co.bizcore.v1.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SimpleArticle extends Domain{
    
    protected int no;
    protected int writer;
    protected String title;
    
}
