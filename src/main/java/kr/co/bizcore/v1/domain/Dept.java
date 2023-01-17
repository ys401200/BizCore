package kr.co.bizcore.v1.domain;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Dept extends Domain {

    private int id;
    private String deptName;
    private String deptId;
    private String parent;
    private String colorCode;
    @JsonIgnore
    private ArrayList<Dept> children = new ArrayList<>();
    private ArrayList<Integer> employee = new ArrayList<>();

    public String getColorCode(){return colorCode == null ? "#ffffff" : colorCode;}
    
    public void addChild(Dept child){children.add(child);};
    public void addEmployee(int employeeNo){employee.add(employeeNo);};
    public void addEmployee(String employeeNo){employee.add(Integer.parseInt(employeeNo));};

    public String[] getChildrenCode(){
        String[] result = null;
        ArrayList<String> data = new ArrayList<>();
        int x = 0;

        for(x = 0 ; x < children.size() ; x++)  data.add(children.get(x).getDeptId());
        data.toArray(result);

        return result;
    } // End of getChildrenCode()

    public String[] getAllChildrenCode(){
        String[] result = null, sub = null;
        ArrayList<String> data = new ArrayList<>();        
        int x = 0, y = 0;

        for(x = 0 ; x < children.size() ; x++){
            data.add(children.get(x).getDeptId());
            sub = children.get(x).getAllChildrenCode();
            for(y = 0 ; y < sub.length ; y++)   data.add(sub[y]);    
        }
        data.toArray(result);

        return result;
    } // End of getAllChildrenCode()

    public int[] getEmployeeNo(){
        int[] result = null;
        int employee = 0, x;
        if(this.employee != null && this.employee.size() > 0){
            for(x = 0 ; x < this.employee.size() ; x++){
                if(result == null)  result = new int[this.employee.size()];
                employee = this.employee.get(x);
                result[x] = employee;
            }
        }

        return result;
    } // End of getEmployeeNo()

    public int[] getAllEmployeeNo(){
        int[] result = null, child = null;;
        Integer[] t = null;
        HashSet<Integer> set = null;
        int x1 = 0, x2 = 0, emp = 0, count = 0;

        child = getEmployeeNo();
        set = new HashSet<>();
        for(x1 = 0 ; x1 < child.length ; x1++)  set.add(child[x1]);

        for(x1 = 0 ; x1 < children.size() ; x1++){
            child = children.get(x1).getAllEmployeeNo();
            for(x2 = 0 ; x2 < child.length ; x2++)set.add(child[x2]);
        }
        result = new int[set.size()];
        set.toArray(t);
        for(x1 = 0 ; x1 < t.length ; x1++)   result[x1] = t[x1];
        return result;
    } // End of getAllEmployeeNo()

    public String getEmployeeNoSqlIn(){
        String result = "";
        int[] emps = null;
        int x = 0;

        emps = getEmployeeNo();
        if(emps != null && emps.length > 0){
            for(x = 0 ; x < emps.length ; x++){
                if(x > 0)   result += ("','");
                else        result = emps[x] + "";
            }
        }

        return result;
    } // End of getEmployeeNoSqlIn()

    public String getAllEmployeeNoSqlIn(){
        String result = "";
        int[] emps = null;
        int x = 0;

        emps = getAllEmployeeNo();
        if(emps != null && emps.length > 0){
            for(x = 0 ; x < emps.length ; x++){
                if(x > 0)   result += ("','");
                else        result = emps[x] + "";
            }
        }

        return result;
    } // End of getAllEmployeeNoSqlIn()

    public HashMap<String, Dept> getMap(){
        HashMap<String, Dept> result = new HashMap<>();
        HashMap<String, Dept> sub = null;
        Object[] keySet = null;
        Dept dept = null;
        int x = 0;

        result.put(this.getDeptId(), this);
        if(this.children != null){
            for(x = 0 ; x < children.size() ; x++){
                dept = children.get(x);
                result.put(dept.getDeptId(), dept);
                sub = children.get(x).getMap();
                if(sub != null && sub.size() > 0){
                    keySet = sub.keySet().toArray();
                    for(Object o : keySet)  result.put((String)o, sub.get(o));
                }
            }
        }

        return result;
    } // End of getMap()

    @Override
    public String toJson() {
        String result = "{";
        String sub = null;
        int x = 0;

        result += ("\"id\":" + id + ",");
        result += ("\"deptName\":" + (deptName == null ? "null" : "\"" + deptName + "\"") + ",");
        result += ("\"deptId\":" + (deptId == null ? "null" : "\"" + deptId + "\"") + ",");
        result += ("\"parent\":" + (parent == null || parent.equals("") ? "null" : "\"" + parent + "\"") + ",");
        result += ("\"colorCode\":" + (colorCode == null ? "null" : "\"" + colorCode + "\"") + ",");
        result += ("\"children\":");

        for(x = 0 ; x < children.size() ; x++){
            if(x == 0)  sub = "[";
            else        sub += ",";
            sub += children.get(x).toJson();
            if(x == children.size() - 1)    sub += "]";
        }

        result = result + sub + "}";
        return result;
    } // End of toJson()

    public String toJsonSingle() {
        String result = "{";
        result += ("\"id\":" + id + ",");
        result += ("\"deptName\":" + (deptName == null ? "null" : "\"" + deptName + "\"") + ",");
        result += ("\"deptId\":" + (deptId == null ? "null" : "\"" + deptId + "\"") + ",");
        result += ("\"parent\":" + (parent == null || parent.equals("") ? "null" : "\"" + parent + "\"") + ",");
        result += ("\"colorCode\":" + (colorCode == null ? "null" : "\"" + colorCode + "\"") + "}");
        return result;
    } // End of toJson()

}
