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

    public void f(){
        //XML 파싱
        DocumentBuilderFactory dbFactoty = DocumentBuilderFactory.newInstance();
        //DocumentBuilder dBuilder = dbFactoty.newDocumentBuilder();
        Document doc = null;
        

        //item이라는 태그의 element들 가져오기
        NodeList nList = doc.getElementsByTagName("item");
        Node nNode = nList.item(0);

        if (nNode.getNodeType() == Node.ELEMENT_NODE) {
            Element eElement = (Element) nNode;
            
            getTagValue("so2Value", eElement);
            
        }
        

    }

    private String getTagValue(String tag, Element el){
        NodeList list = el.getElementsByTagName(tag);
        Node v = (Node)list.item(0);
        return v == null ? null : v.getNodeValue();
    }
    
}
