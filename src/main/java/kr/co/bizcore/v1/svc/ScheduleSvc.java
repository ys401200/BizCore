package kr.co.bizcore.v1.svc;

import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Dept;
import kr.co.bizcore.v1.domain.Schedule;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ScheduleSvc extends Svc{

    private static final Logger logger = LoggerFactory.getLogger(ScheduleSvc.class);

    public String getScheduleListForCalendar(String compId, String scope, String deptIn, String userNo, int year, int month){
        String result = null;
        List<Schedule> list1 = null, list2 = null, list3 = null;
        Date start = null, end = null;
        int y = 0, m = 0, d = 0, x = 0;

        start = new Date();
        end = new Date();
        calcStartAndEndDate(y, m, d, start, end);

        if(scope.equals("dept")){
            list1 = scheduleMapper.getScheduleListFromSalesWithDept(compId, start, end, deptIn);
            list2 = scheduleMapper.getScheduleListFromTechdWithDept(compId, start, end, deptIn);
            list3 = scheduleMapper.getScheduleListFromSchedWithDept(compId, start, end, deptIn);
        }else if(scope.equals("personal")){
            list1 = scheduleMapper.getScheduleListFromSalesWithUser(compId, start, end, userNo);
            list2 = scheduleMapper.getScheduleListFromTechdWithUser(compId, start, end, userNo);
            list3 = scheduleMapper.getScheduleListFromSchedWithUser(compId, start, end, userNo);
        }else{
            list1 = scheduleMapper.getScheduleListFromSched(compId, start, end);
            list2 = scheduleMapper.getScheduleListFromSales(compId, start, end);
            list3 = scheduleMapper.getScheduleListFromTechd(compId, start, end);    
        }

        list1.addAll(list2);
        list1.addAll(list3);
        Collections.sort(list1);

        if(list1 != null){
            result = "[";
            for(x = 0 ; x < list1.size() ; x++){
                if(x > 0)   result += ",";
                result += list1.get(x).toJson();
            }
            result += "]";
        }

        return result;
    } // End of getScheduleList()

    public Schedule getSchedule(String compId, String type, String no){
        Schedule result = null;
        if(type.equals("sales")){
            logger.info("[ScheduleService.getSchedule] ::::::::: type : " + 1);
            result = scheduleMapper.getScheduleFromSales(compId, no);
        }else if(type.equals("tech")){
            logger.info("[ScheduleService.getSchedule] ::::::::: type : " + 2);
            result = scheduleMapper.getScheduleFromTechd(compId, no);
        }else{
            logger.info("[ScheduleService.getSchedule] ::::::::: type : " + 3);
            result = scheduleMapper.getScheduleFromSched(compId, no);
        }
        logger.info("[ScheduleService.getSchedule] ::::::::: Result is NULL : " + (result == null));
        return result;
    }

    public int deleteSchedule(String compId, String type, String no){
        int result = -1;
        if(type.equals("sales"))        result = scheduleMapper.deleteSales(compId, no);
        else if(type.equals("tech"))    result = scheduleMapper.deleteTechd(compId, no);
        else    result = scheduleMapper.deleteSched(compId, no);
        return result;
    }

    public int addSchedule(String compId, Schedule schedule){
        int result = -1;
        String sql = schedule.createInsertQuery(null, compId);
        result = executeSqlQuery(sql);
        return result;
    }

    public int modifySchedule(String compId, Schedule schedule){
        int result = -1;
        Schedule sch = null;
        sch = getSchedule(compId, schedule.getJob(), schedule.getNo() + "");
        String sql = schedule.createUpdateQuery(sch, null);
        sql += " WHERE ";
        if(schedule.getJob().equals("sales")){
            sql += "salesno=";
        }else if(schedule.getJob().equals("tech")){
            sql += "techdno=";
        }else{
            sql += "schedno=";
        }
        sql += schedule.getNo();
        result = executeSqlQuery(sql);
        return result;
    }












    // ======================= 유틸리티 메서드 ===========================

    // int형 시작날짜를 받아서 1달 간격의 시작 및 종료 date를 반환하는 메서드 / start와 end는 반드시 null이 아닌 다른 인스턴스를 넣을 것
    private void calcStartAndEndDate(int y, int m, int d, Date start, Date end){
        Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(0);
        cal.set(y, m, d, 0, 0, 0);
        start.setTime(cal.getTimeInMillis());
        cal.add(Calendar.MONTH, 1);
        end.setTime(cal.getTimeInMillis());
    } // End of calcStartAndEndDate()
    
}
