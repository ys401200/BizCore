package kr.co.bizcore.v1.svc;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Schedule;
import kr.co.bizcore.v1.domain.SimpleNotice;
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
}
