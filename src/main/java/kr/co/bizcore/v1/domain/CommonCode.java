package kr.co.bizcore.v1.domain;

import java.util.ArrayList;

public class CommonCode extends Domain{

    private String desc;
    private String value;
    private String childSelector;
    private ArrayList<CommonCode> children = new ArrayList<>();

    public CommonCode(){}
    public CommonCode(String[] v){desc = v[0]; value = v[1];childSelector = v[2];}

    public void addChildren(CommonCode code){children.add(code);}
    public void setDesc(String desc){this.desc = desc;}
    public void setValue(String value){this.value = value;}
    public void setChildSelector(String child){childSelector = child;}
    public String getDesc(){return desc;}
    public String getValue(){return value;}
    public String getChildSelector(){return childSelector;}
    public ArrayList<CommonCode> getChildren(){return children;}

    public String toString(){
        return toJson();
    }

    @Override
    public String toJson() {
        String result = null;
        int x = 0;
        result = "{\"desc\":\"" + desc + "\",";
        result += ("\"value\":\"" + value + "\",");
        result += ("\"selector\":\"" + childSelector + "\",");
        result += ("\"children\":[");
        for(x = 0 ; x < children.size() ; x++){
            if(x > 0)   result += ",";
            result += children.get(x);
        }
        result += "]}";
        return result;
    } // End of toJson();
    
}
