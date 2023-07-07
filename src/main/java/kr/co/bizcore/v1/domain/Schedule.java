package kr.co.bizcore.v1.domain;

import java.util.Date;
import java.util.HashMap;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Schedule extends Domain{
    //2023.07.15
    private int schedNo;
    private int userNo;
    private int compNo;
    private int soppNo;
    private int custNo;
    private String schedName;
    private String schedFrom;
    private String schedTo;
    private String title;
    private String desc;
    private int schedCheck;
    private int subschedNo;
    private String schedActive;
    private String schedAllday;
    private String remindflag;
    private int schedType;
    private String schedPlace;
    private String schedColor;
    private String schedCat;
    private int contNo;
    private String regDatetime;
    private String modDatetime;
    private String attrib;
    //2023.07.15

    private String job;
    private int no;
    private int writer;
    private int sopp;
    private int customer;
    private Date from;
    private Date to;
    private String content;
    private boolean report;
    private String type;
    private String place;

    // 영업 추가 필드들
    private int partner;

    // 기술지원 추가 필드들
    private int contract;
    private String contractMethod;
    private int cipOfCustomer;
    private String supportModel;
    private String supportVersion;
    private String supportStep;

    //public Schedule(){super();report = true;}

    //public void setWorkReport(int x){report=x==1;}

    // 기타 일정 json 추출
    private String jsonSchedule(){
        String result = "{";
        result += ("\"job\":\"" + job + "\",");
        result += ("\"no\":" + no + ",");
        result += ("\"writer\":" + writer + ",");
        result += ("\"sopp\":" + sopp + ",");
        result += ("\"customer\":" + customer + ",");
        result += ("\"from\":" + (from == null ? "null" : from.getTime()) + ",");
        result += ("\"to\":" + (to == null ? "null" : to.getTime()) + ",");
        result += ("\"title\":" + (title == null ? "null" : "\"" + title + "\"") + ",");
        result += ("\"content\":" + (content == null ? "null" : "\"" + content.replaceAll("\"", "\\u0022").replaceAll("\n", "<br />").replaceAll("\r", "").replaceAll("\t", "").replaceAll("\\\\", "\\u005c") + "\"") + ",");
        result += ("\"report\":" + report + ",");
        result += ("\"type\":" + (type == null ? "null" : "\"" + type + "\"") + ",");
        result += ("\"created\":" + (created == null ? "null" : created.getTime()) + ",");
        result += ("\"modified\":" + (modified == null ? "null" : modified.getTime()) + ",");
        result += ("\"place\":\"" + place + "\"}");
        return result;
    }

    // 영업 일정 json 추출
    private String jsonSales(){
        String result = "{";
        result += ("\"job\":\"" + job + "\",");
        result += ("\"no\":" + no + ",");
        result += ("\"writer\":" + writer + ",");
        result += ("\"sopp\":" + sopp + ",");
        result += ("\"customer\":" + customer + ",");
        result += ("\"from\":" + (from == null ? "null" : from.getTime()) + ",");
        result += ("\"to\":" + (to == null ? "null" : to.getTime()) + ",");
        result += ("\"title\":" + (title == null ? "null" : "\"" + title + "\"") + ",");
        result += ("\"content\":" + (content == null ? "null" : "\"" + content.replaceAll("\"", "\\u0022").replaceAll("\n", "<br />").replaceAll("\r", "").replaceAll("\t", "").replaceAll("\\\\", "\\u005c") + "\"") + ",");
        result += ("\"report\":" + report + ",");
        result += ("\"type\":" + (type == null ? "null" : "\"" + type + "\"") + ",");
        result += ("\"created\":" + (created == null ? "null" : created.getTime()) + ",");
        result += ("\"modified\":" + (modified == null ? "null" : modified.getTime()) + ",");
        result += ("\"place\":\"" + place + "\",");
        result += ("\"partner\":" + partner);
        result += "}";
        return result;
    }

    // 기술지원 일정 json 추출
    private String jsonTech(){
        String result = "{";
        result += ("\"job\":\"" + job + "\",");
        result += ("\"no\":" + no + ",");
        result += ("\"writer\":" + writer + ",");
        result += ("\"sopp\":" + sopp + ",");
        result += ("\"customer\":" + customer + ",");
        result += ("\"from\":" + (from == null ? "null" : from.getTime()) + ",");
        result += ("\"to\":" + (to == null ? "null" : to.getTime()) + ",");
        result += ("\"title\":" + (title == null ? "null" : "\"" + title + "\"") + ",");
        result += ("\"content\":" + (content == null ? "null" : "\"" + content.replaceAll("\"", "\\u0022").replaceAll("\n", "<br />").replaceAll("\r", "").replaceAll("\t", "").replaceAll("\\\\", "\\u005c") + "\"") + ",");
        result += ("\"report\":" + report + ",");
        result += ("\"created\":" + (created == null ? "null" : created.getTime()) + ",");
        result += ("\"modified\":" + (modified == null ? "null" : modified.getTime()) + ",");
        result += ("\"type\":" + (type == null ? "null" : "\"" + type + "\"") + ",");
        result += ("\"place\":\"" + place + "\",");
        result += ("\"partner\":" + partner) + ",";
        result += ("\"contract\":" + contract) + ",";
        result += ("\"contractMethod\":" + (contractMethod == null ? "null" : "\"" + contractMethod + "\"") + ",");
        result += ("\"cipOfCustomer\":" + cipOfCustomer) + ",";
        result += ("\"supportModel\":" + (supportModel == null ? "null" : "\"" + supportModel + "\"") + ",");
        result += ("\"supportVersion\":" + (supportVersion == null ? "null" : "\"" + supportVersion + "\"") + ",");
        result += ("\"supportStep\":" + (supportStep == null ? "null" : "\"" + supportStep + "\""));
        result += "}";
        return result;
    }

    public String toJson(){
        String result = null;
        if(job.equals("schedule"))      result = jsonSchedule();
        else if(job.equals("sales"))    result = jsonSales();
        else if(job.equals("tech"))     result = jsonTech();
        return result;
    }

    

    // ==============================================================================
    // DB 작업을 위한 Domain 클래스에서 참조하는 테이블명, 컬럼명이 담깅 맵을 만드는 메서드 오버라이딩
    // ==============================================================================
    protected HashMap<String, String> getTableMap(){
        HashMap<String, String> tableMap = new HashMap<>();
        if(job != null && job.equals("sales"))      tableMap.put("Schedule", "swc_sales");
        else if(job != null && job.equals("tech"))  tableMap.put("Schedule", "swc_techd");
        else tableMap.put("Schedule", "swc_sched");
        return tableMap;
    }

    protected HashMap<String, HashMap<String, String>> getFieldMap(){
        HashMap<String, HashMap<String, String>> fieldMap = new HashMap<>();
        HashMap<String, String> column = null;

        column = new HashMap<>();
        fieldMap.put("Schedule", column);

        if(job != null && job.equals("sales")){
            column.put("no", "salesNo");
            column.put("writer", "userNo");
            column.put("sopp", "soppNo");
            column.put("customer", "ptncNo");
            column.put("from", "salesFrdatetime");
            column.put("to", "salesTodatetime");
            column.put("title", "salesTitle");
            column.put("content", "salesDesc");
            column.put("report", "salesCheck");
            column.put("type", "salesType");
            column.put("place", "salesPlace");
            column.put("partner", "custNo");
            column.put("created","regdatetime");
            column.put("modified","moddatetime");
        }else if(job != null && job.equals("tech")){
            column.put("no", "techdNo");
            column.put("writer", "userNo");
            column.put("sopp", "soppNo");
            column.put("customer", "endCustNo");
            column.put("from", "techdFrom");
            column.put("to", "techdTo");
            column.put("title", "techdTitle");
            column.put("content", "techdDesc");
            column.put("report", "techdCheck");
            column.put("type", "techdType");
            column.put("place", "techdPlace");
            column.put("partner", "custNo");
            column.put("contract", "contNo");
            column.put("contractMethod", "cntrctMth");
            column.put("cipOfCustomer", "custmemberNo");
            column.put("supportModel", "techdItemmodel");
            column.put("supportVersion", "techdItemversion");
            column.put("supportStep", "techdSteps");
            column.put("created","regdatetime");
            column.put("modified","moddatetime");
        }else{
            column.put("no", "schedNo");
            column.put("writer", "userNo");
            column.put("sopp", "soppNo");
            column.put("customer", "custNo");
            column.put("from", "schedFrom");
            column.put("to", "schedTo");
            column.put("title", "schedTitle");
            column.put("content", "schedDesc");
            column.put("report", "schedCheck");
            column.put("type", "schedType");
            column.put("place", "schedPlace");
            column.put("created","regdatetime");
            column.put("modified","moddatetime");
        }
        return fieldMap;
    }
}
