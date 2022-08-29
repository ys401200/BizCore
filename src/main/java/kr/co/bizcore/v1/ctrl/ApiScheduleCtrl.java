package kr.co.bizcore.v1.ctrl;

import java.util.Calendar;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.bizcore.v1.domain.Dept;
import kr.co.bizcore.v1.domain.Sched;
import kr.co.bizcore.v1.domain.Schedule;
import kr.co.bizcore.v1.domain.SimpleUser;
import kr.co.bizcore.v1.mapper.ScheduleMapper;
import lombok.extern.slf4j.Slf4j;

@RequestMapping("/api/schedule")
@RestController
@Slf4j
public class ApiScheduleCtrl extends Ctrl {

    private static final Logger logger = LoggerFactory.getLogger(AccountingController.class);

    // 캘린더 정보 요청에 대한 처리 / 연월 정보 없음 / 현재 연월
    @GetMapping("/calendar/company/{scope}")
    public String apiScheduleCalendar(HttpServletRequest request, @PathVariable("scope") String scope){
        String result = null;
        int yy = 0, mm = 0;
        Calendar cal = Calendar.getInstance();

        if(scope != null && (scope.equals("company") || scope.equals("dept") || scope.equals("personal"))){
            yy = cal.get(Calendar.YEAR);
            mm = cal.get(Calendar.MONTH) + 1;
            result = apiScheduleCalendar(request, scope, yy, mm);
        }else{
            result = "{\"result\":\"failure\",\"msg\":\"Requested scope wrong or not exist.\"}";
        }
        
        return result;
    } // End of apiScheduleCalendar()

    // 캘린더 정보 요청에 대한 처리 / 요청 연월에 대한 처리
    @GetMapping("/calendar/{scope:\\D+}/{year:\\d+}/{month:\\d+}")
    public String apiScheduleCalendar(HttpServletRequest request, @PathVariable("scope") String scope, @PathVariable("year") int year, @PathVariable("month") int month){
        String result = null;
        String compId = null, yy = null, mm = null, aesKey = null, aesIv = null, data = null, userNo = null;
        int maxYear = 0, minYear = 0;
        Calendar cal = Calendar.getInstance();
        HttpSession session = null;
        Dept rootDept = null;

        minYear = cal.get(Calendar.YEAR) - 5;
        maxYear = cal.get(Calendar.YEAR) + 1;
        session = request.getSession();
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        compId = (String)session.getAttribute("compId");
        userNo = (String)session.getAttribute("userNo");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else if(scope != null && (scope.equals("company") || scope.equals("dept") || scope.equals("personal"))){
            result = "{\"result\":\"failure\",\"msg\":\"Requested scope wrong or not exist.\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
        }else if(year < minYear || year > maxYear){
            result = "{\"result\":\"failure\",\"msg\":\"Date Exceeded.\"}";
        }else{
            rootDept = deptService.rootDept(compId);
            data = scheduleService.getScheduleListForCalendar(compId, scope, rootDept.getEmployeeNoSqlIn(), userNo, year, month);
            if(data != null){
                data = userService.encAes(data, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
            }else{
                result = "{\"result\":\"failure\",\"msg\":\"Error occured.\"}";
            }
        }
        return result;
    } // End of apiScheduleCalendar()

    // 단일 일정에 대한 조회 요청
    @GetMapping("/{type:\\D+}/{no:\\d+}")
    public String apiScheduleTypeNoGet(HttpServletRequest request, @PathVariable String type, @PathVariable int no){
        String result = null;
        String compId = null, aesKey = null, aesIv = null;
        Schedule data = null;
        HttpSession session = null;

        session = request.getSession();
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
        }else{
            data = scheduleService.getSchedule(compId, type, no + "");
            if(data != null){
                result = encAes(data.toJson(), aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
            }else{
                result = "{\"result\":\"failure\",\"msg\":\"Error occured.\"}";
            }
        }

        return result;
    }

    // 단일 일정에 대한 신규 요청
    @PostMapping("/{type:\\D+}")
    public String apiScheduleTypePost(HttpServletRequest request, @RequestBody String requestBody, @PathVariable String type, @PathVariable int no){
        String result = null;

        return result;
    }

    // 단일 일정에 대한 수정 요청
    @PutMapping("/{type:\\D+}/{no:\\d+}")
    public String apiScheduleTypeNoPut(HttpServletRequest request, @RequestBody String requestBody, @PathVariable String type, @PathVariable int no){
        String result = null;

        return result;
    }

    // 단일 일정에 대한 삭제 요청
    @DeleteMapping("/{type:\\D+}/{no:\\d+}")
    public String apiScheduleTypeNoDelete(HttpServletRequest request, @PathVariable String type, @PathVariable int no){
        String result = null;
        String compId = null, aesKey = null, aesIv = null;
        int count = -1;
        HttpSession session = null;

        session = request.getSession();
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else{
            if(type.equals("sales") || type.equals("tech") || type.equals("schedule")){
                count = scheduleService.deleteSchedule(compId, type, no + "");
                if(count > 1)   result = "{\"result\":\"failure\",\"msg\":\"Error occured.\"}";
                else            result = "{\"result\":\"failure\",\"msg\":\"Error occured.\"}";
            }else   result = "{\"result\":\"failure\",\"msg\":\"Schedule type mismatch..\"}";
        }
        return result;
    }


    @RequestMapping(value = "", method = RequestMethod.POST)
    public String apiSchedulePost(HttpServletRequest request, @RequestBody String requestBody){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String json = null;
        ObjectMapper mapper = null;
        Sched schedule = null;
        HttpSession session = null;

        mapper = new ObjectMapper();
        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
        }else{
            json = salesService.decAes(requestBody, aesKey, aesIv);
            try {
                //schedule = mapper.readValue(json, Schedule.class);
                //if(scheduleService.addSchedule(schedule, compId))   result = "{\"result\":\"ok\"}";
                //else                                                result = "{\"result\":\"failure\",\"msg\":\"An error occurred.\"}";
            } catch (Exception e) {
                result = "{\"result\":\"failure\",\"msg\":\"Data is wrong.\"}";
            }
        }
        return result;
    }

    @RequestMapping(value = "/{no}", method = RequestMethod.PUT)
    public String apiSchedulePut(HttpServletRequest request, @RequestBody String requestBody, @PathVariable String no){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String json = null;
        ObjectMapper mapper = null;
        Sched schedule = null;
        HttpSession session = null;

        mapper = new ObjectMapper();
        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
        }else{
            json = salesService.decAes(requestBody, aesKey, aesIv);
            try {
                //schedule = mapper.readValue(json, Schedule.class);
                //if(scheduleService.modifySchedule(no, schedule, compId))    result = "{\"result\":\"ok\"}";
                //else                                                        result = "{\"result\":\"failure\",\"msg\":\"An error occurred.\"}";
            } catch (Exception e) {
                result = "{\"result\":\"failure\",\"msg\":\"Data is wrong.\"}";
            }
        }
        return result;
    }

    @RequestMapping(value = "/{no}", method = RequestMethod.DELETE)
    public String apiScheduleDelete(HttpServletRequest request, @PathVariable String no){
        String result = null;
        String compId = null;
        HttpSession session = null;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else{
            //if(scheduleService.removeSchedule(no, compId))  result = "{\"result\":\"ok\"}";
            //else                                            result = "{\"result\":\"failure\",\"msg\":\"An error occurred.\"}";
        }
        return result;
    }


    
}
