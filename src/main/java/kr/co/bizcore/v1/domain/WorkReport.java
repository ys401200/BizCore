package kr.co.bizcore.v1.domain;

import java.util.ArrayList;
import java.util.Collections;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class WorkReport extends Domain{

    private int writer;
    private String content1;
    private String content2;
    private ArrayList<Schedule> schedules = new ArrayList<>();

    public void addSchedule(Schedule e){schedules.add(e);}

    public String toJson(){
        String result = "{", t = null;
        int x = 0;
        Schedule e = null;
        if(schedules.size() > 2)    Collections.sort(schedules);
        result += ("\"writer\":" + writer + ",");
        result += ("\"content1\":\"" + content1 + "\",");
        result += ("\"content2\":\"" + content2 + "\",");
        result += "\"schedules\":[";
        for(x = 0 ; x < schedules.size() ; x++){
            e = schedules.get(x);
            if(e.getJob().equals("sales"))  t = "$ ";
            else if(e.getJob().equals("tech"))  t = "@ ";
            else    t = "# ";
            if(x > 0)   result += ",";
            result += ("\"{title\":\"" + t + e.getTitle() + "\",");
            result += ("\"content\":\"" + e.getContent() + "\",");
            result += ("\"date\":" + (e.getFrom() != null ? e.getFrom().getTime() : null) + "}");
        }
        result += "]}";
        return result;
    } // End of toJson()
    
}
