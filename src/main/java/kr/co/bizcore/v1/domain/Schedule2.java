package kr.co.bizcore.v1.domain;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class Schedule2 extends Domain {
    
    private int no;
    private int writer;
    private String title;
    private String content;
    private boolean report;
    private String type;
    private Date from;
    private Date to;
    private String related;
    private Byte permitted;    
    
    public String toString(){
        String result = null;
        result = "no : " + no + "\n";
        result += ("writer : " + writer + "\n");
        result += ("title : " + (title == null ? "null" : "\"" + title + "\"") + "\n");
        result += ("content : " + (content == null ? "null" : "\"" + content.replaceAll("\r", "").replaceAll("\n", "").replaceAll("\t", "") + "\"") + "\n");
        result += ("report : " + report + "\n");
        result += ("type : " + (type == null ? "null" : "\"" + type + "\"") + "\n");
        result += ("from : " + (from == null ? "null" : from.getTime()) + "\n");
        result += ("to : " + (to == null ? "null" : to.getTime()) + "\n");
        result += ("related : " + (type == null ? "null" : related) + "\n");
        result += ("permitted : " + (permitted == null ? "null" : "\"" + permitted + "\"") + "\n");
        result += ("created : " + (created == null ? "null" : created.getTime()) + "\n");
        result += ("modified : " + (modified == null ? "null" : modified.getTime()) + "\n");

        return result;
    }
}
