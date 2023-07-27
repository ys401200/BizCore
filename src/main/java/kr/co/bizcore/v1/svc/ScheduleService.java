package kr.co.bizcore.v1.svc;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Schedule;
import kr.co.bizcore.v1.mapper.ScheduleMapper;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ScheduleService extends Svc {
    private static final Logger logger = LoggerFactory.getLogger(NoticeSvc.class);
    
    @Autowired
    private ScheduleMapper scheduleMapper;

    public List<Schedule> getList(int compNo) {
       return scheduleMapper.getList(compNo);
    }

    public Schedule getScheduleOne(int compNo, String schedNo){
        Schedule schedule = null;
        schedule = scheduleMapper.getScheduleOne(schedNo, compNo);
        return schedule;
    }

    public int insertSchedule(Schedule schedule) {
        return scheduleMapper.scheduleInsert(schedule);
    }

    public int updateSchedule(Schedule schedule) {
        return scheduleMapper.updateSchedule(schedule);
    }
    
    public int delete(int compNo, String schedNo) {
        return scheduleMapper.deleteSchedule(compNo, schedNo);
    }
}
