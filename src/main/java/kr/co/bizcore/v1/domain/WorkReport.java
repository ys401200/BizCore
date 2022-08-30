package kr.co.bizcore.v1.domain;

import java.util.ArrayList;
import java.util.Collections;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class WorkReport extends Domain{

    private int writer;
    private String currentWeek;
    private String nextWeek;
    private ArrayList<Schedule> schedules = new ArrayList<>();

    public void addSchedule(Schedule e){schedules.add(e);}

    public String toJson(){
        String result = "{", t = null;
        int x = 0;
        Schedule e = null;
        if(schedules.size() > 2)    Collections.sort(schedules);
        result += ("\"currentWeek\":" + (currentWeek == null ? "\"\"" : "\"" + currentWeek.replaceAll("\"", "\\u0022").replaceAll("\n", "").replaceAll("\r", "").replaceAll("\t", "") + "\"") + ",");
        result += ("\"nextWeek\":" + (nextWeek == null ? "\"\"" : "\"" + nextWeek.replaceAll("\"", "\\u0022").replaceAll("\n", "").replaceAll("\r", "").replaceAll("\t", "") + "\"") + ",");
        result += "\"schedules\":[";
        for(x = 0 ; x < schedules.size() ; x++){
            e = schedules.get(x);
            if(e.getJob().equals("sales"))  t = "$ ";
            else if(e.getJob().equals("tech"))  t = "@ ";
            else    t = "# ";
            if(x > 0)   result += ",";
            result += ("{\"title\":\"" + t + e.getTitle() + "\",");
            result += ("\"content\":" + ( e != null && e.getContent() != null ? "\"" + e.getContent().replaceAll("\"", "\\u0022").replaceAll("\n", "<br />").replaceAll("\r", "").replaceAll("\t", "") + "\"" : "\"\"") + ",");
            result += ("\"date\":" + (e.getFrom() != null ? e.getFrom().getTime() : null) + "}");
        }
        result += "]}";
        return result;
    } // End of toJson()
    
}
