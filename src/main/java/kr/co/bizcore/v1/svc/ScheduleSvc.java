package kr.co.bizcore.v1.svc;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Sched;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ScheduleSvc extends Svc{

    private static final Logger logger = LoggerFactory.getLogger(ScheduleSvc.class);

    public String getScheduleList(String compId, String userNo, int year, int month, String deptIn){
        String result = null, dept;
        List<Sched> list = null;
        int x = 0;

        list = scheduleMapper.getSchedule(compId, year + "-" + month + "-1", deptIn);
        if(list != null){
            result = "[";
            for(x = 0 ; x < list.size() ; x++){
                if(x > 0)   result += ",";
                result += list.get(x).toJson();
            }
            result += "]";
        }

        return result;
    } // End of getScheduleList()
    
}
