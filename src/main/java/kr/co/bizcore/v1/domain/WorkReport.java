package kr.co.bizcore.v1.domain;

import java.util.ArrayList;
import java.util.Collections;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class WorkReport extends Domain{

    private int writer;
    private boolean currentWeekCheck;
    private String currentWeek;
    private boolean previousWeekCheck;
    private String previousWeek;
    private ArrayList<Schedule> schedules = new ArrayList<>();

    public void addSchedule(Schedule e){schedules.add(e);}

    public String toJson(){
        String result = "{", t = null;
        int x = 0;
        Schedule e = null;
        if(schedules.size() > 2)    Collections.sort(schedules);
        result += ("\"currentWeekCheck\":" + currentWeekCheck + ",");
        result += ("\"currentWeek\":" + (currentWeek == null ? "\"\"" : "\"" + currentWeek.replaceAll("\"", "\\u0022").replaceAll("\n", "").replaceAll("\r", "").replaceAll("\t", "").replaceAll("\\\\", "\\u005c") + "\"") + ",");
        result += ("\"previousWeekCheck\":" + previousWeekCheck + ",");
        result += ("\"previousWeek\":" + (previousWeek == null ? "\"\"" : "\"" + previousWeek.replaceAll("\"", "\\u0022").replaceAll("\n", "").replaceAll("\r", "").replaceAll("\t", "").replaceAll("\\\\", "\\u005c") + "\"") + ",");
        result += "\"schedules\":[";
        for(x = 0 ; x < schedules.size() ; x++){
            e = schedules.get(x);
            if(e.getJob().equals("sales"))  t = "$ ";
            else if(e.getJob().equals("tech"))  t = "@ ";
            else    t = "# ";
            if(x > 0)   result += ",";
            result += ("{\"title\":\"" + t + e.getTitle() + "\",");
            result += ("\"job\":\"" + e.getJob() + "\",");
            result += ("\"no\":" + e.getNo() + ",");
            result += ("\"report\":" + e.isReport() + ","); 
            result += ("\"content\":" + ( e != null && e.getContent() != null ? "\"" + e.getContent().replaceAll("\"", "\\u0022").replaceAll("\n", "<br />").replaceAll("\r", "").replaceAll("\t", "").replaceAll("\\\\", "\\u005c") + "\"" : "\"\"") + ",");
            result += ("\"date\":" + (e.getFrom() != null ? e.getFrom().getTime() : null) + ",");
            result += ("\"created\":" + (e.getCreated() != null ? e.getCreated().getTime() : null) + ",");
            result += ("\"customer\":" + e.getCustomer() + ",");
            result += ("\"from\":" + (e.getFrom() != null ? e.getFrom().getTime() : null) + ",");
            result += ("\"modified\":" + (e.getModified() != null ? e.getModified().getTime() : null) + ",");
            result += ("\"place\":" + (e.getPlace() != null && !e.getPlace().equals("") ? "\"" + e.getPlace() + "\"" : null) + ",");
            result += ("\"sopp\":" + e.getSopp() + ",");
            result += ("\"type\":" + (e.getType() != null ? e.getType() : null) + ",");
            result += ("\"to\":" + (e.getTo() != null ? e.getTo().getTime() : null) + "}");
        }
        result += "]}";
        return result;
    } // End of toJson()
    
}

