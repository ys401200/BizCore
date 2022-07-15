package kr.co.bizcore.v1.svc;

import java.util.List;

import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Schedule;

@Service
public class ScheduleSvc extends Svc{

    public String getScheduleList(String compId, String userNo, int year, int month, String deptIn){
        String result = null, dept;
        List<Schedule> list = null;
        int x = 0;

        list = scheduleMapper.getSchedule(compId, year + "-" + month + "-1", deptIn);
        if(list != null){
            for(x = 0 ; x < list.size() ; x++){
                if(x == 0)  result = "[";
                else    result += ",";
                result += list.get(x).toJson();
            }
            result += "]";
        }

        return result;
    } // End of getScheduleList()
    
}
