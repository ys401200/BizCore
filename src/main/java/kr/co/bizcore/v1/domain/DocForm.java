package kr.co.bizcore.v1.domain;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

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
