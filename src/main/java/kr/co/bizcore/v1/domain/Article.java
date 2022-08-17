package kr.co.bizcore.v1.domain;

import java.util.ArrayList;

import javax.xml.bind.annotation.XmlElement;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Article extends SimpleArticle{

    @XmlElement(nillable=true)
    private String content;
    @XmlElement(nillable=true)
    private String related;
    private ArrayList<AttachedFile> attached;

    public int addAttachedFile(AttachedFile file){
        int result = -1;
        if(file == null)    return result;
        if(attached == null)    attached = new ArrayList<>();
        attached.add(file);
        return result;
    }

    public Article(){}
    
}
