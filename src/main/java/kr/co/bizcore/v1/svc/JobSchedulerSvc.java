package kr.co.bizcore.v1.svc;

import java.util.Calendar;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class JobSchedulerSvc extends Svc{
    private static int lastWorkDate;
    private static int lastWorktime;

    @Scheduled(fixedDelay = 60000)
    public void scheduleJob(){

        // 초기화 작업


        // 작업시간 기록
        lastWorkDate = getDate();
        lastWorktime = getTime();
        System.out.println("[Scheduler] Schedule Job Start : " + getDate() + " " + getTime());


        // 스케줄 작업
    } // End of scheduleJob()

    private int getDate(){
        int result = 0;
        Calendar cal = Calendar.getInstance();
        result = cal.get(Calendar.YEAR) * 10000;
        result += (cal.get(Calendar.MONTH) + 1) * 100;
        result += cal.get(Calendar.DATE);
        return result;
    } // End of getDate()

    private int getTime(){
        int result = 0;
        Calendar cal = Calendar.getInstance();
        result = cal.get(Calendar.HOUR) * 10000;
        result += cal.get(Calendar.MINUTE) * 100;
        result += cal.get(Calendar.SECOND);
        return result;
    } // End of getDate()
    
    
}
