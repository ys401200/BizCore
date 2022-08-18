package kr.co.bizcore.v1.svc;

import java.io.File;
import java.util.Calendar;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;


@Component
@Slf4j
public class JobSchedulerSvc extends Svc{

    private static final Logger logger = LoggerFactory.getLogger(JobSchedulerSvc.class);
    private static int lastWorkDate;
    private static int lastWorktime;

    @Scheduled(fixedDelay = 60000)
    public void scheduleJob(){

        // 초기화 작업


        // 작업시간 기록
        lastWorkDate = getDate();
        lastWorktime = getTime();
        System.out.println("[Scheduler] Schedule Job Start : " + getDate() + " " + getTime());

        // 임시파일 정리
        cleanTempFiles();

        // 스케줄 작업
    } // End of scheduleJob()

    // 임시 폴더의 파일들을 정리하는 메서드
    private void cleanTempFiles(){
        long time = System.currentTimeMillis() - (60000 * 30);
        File root = null;
        int x = 0;

        logger.debug("[Job Scheduler] Start clean temp files");

        root = new File(this.fileStoragePath);
        for(File comp : root.listFiles()){
            if(comp.isDirectory()){
                for(File child : comp.listFiles()){
                    if(child.isDirectory() && child.getName().equals("temp")){
                        for(File temp : child.listFiles()){
                            if(temp.lastModified() < time){
                                logger.debug("[Job Scheduler] Delete temp file : " + temp.getName());
                                if(temp.delete())   x++;
                            }
                        }
                    }
                }
            }
        }

        logger.debug("[Job Scheduler] Deleted temp files : " + x);

    }

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
