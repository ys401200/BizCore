package kr.co.bizcore.v1.ctrl;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import kr.co.bizcore.v1.domain.Schedule;
import kr.co.bizcore.v1.domain.Sopp;
import kr.co.bizcore.v1.domain.TradeDetail;
import kr.co.bizcore.v1.svc.SoppService;
import kr.co.bizcore.v1.svc.SystemService;
import kr.co.bizcore.v1.svc.TestService;
import kr.co.bizcore.v1.svc.TradeService;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/system")
@Slf4j
public class SystemCtrl extends Ctrl {

    private static final Logger logger = LoggerFactory.getLogger(SystemCtrl.class);

    @Autowired
    private SoppService svc;

    @Autowired
    private TestService tsvc;

    @Autowired
    private SystemService systemService;

    @RequestMapping(value = "/connUrl", method = RequestMethod.GET)
    public String connUrl() {
        return systemService.getConnUrl();
    } // End of connUrl()

    @GetMapping("/test/{no}")
    public String test(@PathVariable String no){
        String result = null;

        Sopp e1 = null, e2 = null;
        //e1 = svc.getSopp(no, "vtek");
        //e2 = svc.getSopp(10005598 + "", "vtek");

        

        //result = e1.createInsertQuery(null, null);
        if(e1 == null)  result = "null";
        else{
            result = e1.createInsertQuery(null, "vtek");
            result = "result" + svc.executeSqlQuery(result);
        }

        return result;
    } // End of test()

    @GetMapping("/test/file")
    public String file(){
        tsvc.dbToStorageGwFile();
        return "00000";
    } // End of test()

    @GetMapping("/doc")
    public String getDocList(HttpServletRequest request, HttpServletResponse response){
        String result = null;

        response.setContentType("application/json;charset=utf-8");

        result = tsvc.docList();

        if(result == null)  result = "{\"result\":\"failure\",\"msg\":\"Data is null.\"}";
        else        result = "{\"result\":\"ok\",\"data\":" + result + "}";



        return result;
    }

    @GetMapping("/doc/{docNo}")
    public String getDocData(HttpServletRequest request, HttpServletResponse response, @PathVariable String docNo){
        String result = null, data1 = null, data2 = null, data3 = null;

        response.setContentType("application/json;charset=utf-8");

        data1 = tsvc.docFile(docNo);
        data2 = tsvc.docData(docNo);
        data3 = tsvc.docApp(docNo);

        result = "{\"result\":\"ok\",\"files\":" + (data1 == null ? "null" : data1) + ",\"docData\":" + (data2 == null ? "null" : data2) + ",\"appData\":" + (data3 == null ? "null" : data3) + "}";



        return result;
    }
    

    @GetMapping("/schedule/{docNo}")
    public String getScheduleData(HttpServletRequest request, HttpServletResponse response, @PathVariable String docNo){
        String result = null, data = null;
        Schedule sch = null, sch2 = null;

        response.setContentType("application/json;charset=utf-8");
        sch = scheduleService.getSchedule("vtek", "schedule", docNo);
        sch2 = scheduleService.getSchedule("vtek", "schedule", "10064972");

        logger.info("[TEST] :::::::::::::::::::::::::: schedule 1 : " + sch.toJson());
        logger.info("[TEST] :::::::::::::::::::::::::: schedule 2 : " + sch.toJson());

        result = "{\"result\":\"ok\",\"data\":" + (sch == null ? "null" : "\"" + sch.createUpdateQuery(sch2, null) + "\"") + "}";
        
        return result;
    }

    @GetMapping("/sopp/file")
    public String saveSoppFile(HttpServletRequest request){
        String result = null;
        int count = -1;

        count = systemService.soppFileDownloadAndSave();
        result = "{\"count\":" + count + "}";

        return result;
    }

}
