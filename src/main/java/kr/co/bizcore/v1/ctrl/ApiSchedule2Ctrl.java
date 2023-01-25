package kr.co.bizcore.v1.ctrl;

import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.bizcore.v1.domain.Project;
import kr.co.bizcore.v1.domain.Schedule2;
import kr.co.bizcore.v1.mapper.Schedule2Mapper;
import kr.co.bizcore.v1.msg.Msg;
import lombok.extern.slf4j.Slf4j;

@RequestMapping("/api/schedule2")
@RestController
@Slf4j
public class ApiSchedule2Ctrl extends Ctrl {

    private static final Logger logger = LoggerFactory.getLogger(AccountingController.class);

    @PostMapping("")
    public String schedulePost(HttpServletRequest request, @RequestBody String requestBody) throws JsonMappingException, JsonProcessingException{
        String result = null;
        String compId = null, aesKey = null, aesIv = null, data = null;
        ObjectMapper mapper = null;
        Schedule2 sch = null;
        String r = null;
        Msg msg = null;
        HttpSession session = null;

        mapper = new ObjectMapper();
        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)session.getAttribute("compId");
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        msg = getMsg((String)session.getAttribute("lang"));

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            data = decAes(requestBody, aesKey, aesIv);
            sch = mapper.readValue(data, Schedule2.class);
            r = schedule2Svc.updateSchedule(sch, compId);
            if(r == null)   result = "{\"result\":\"failure\",\"msg\":\"project is null.\"}";
            else if(r.equals(""))  result = "{\"result\":\"failure\",\"msg\":\"update count is zero.\"}";
            else    result = "{\"result\":\"ok\",\"data\":\"" + r + "\"}";
        }
        
        return result;
    } // End of projectNoGet()

    @GetMapping("/sopp/{no:\\d+}")
    public String scheduleSoppGet(HttpServletRequest request, @PathVariable("no") int sopp){
        String result = null;
        String compId = null, aesKey = null, aesIv = null, data = null, userNo = null;
        Msg msg = null;
        HttpSession session = null;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)session.getAttribute("compId");
        userNo = (String)session.getAttribute("userNo");
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        msg = getMsg((String)session.getAttribute("lang"));

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            data = schedule2Svc.getScheduleWithSopp(compId, userNo, sopp);
            if(data == null)   result = "{\"result\":\"failure\",\"msg\":\"" + msg.unknownError + "\"}";
            else if(data.equals("permissionDenied"))    result = "{\"result\":\"failure\",\"msg\":\"" + msg.permissionDenied + "\"}";
            else    result = "{\"result\":\"ok\",\"data\":\"" + encAes(data, aesKey, aesIv) + "\"}";
        }
        
        return result;
    } // End of projectNoGet()

    @GetMapping("{no:\\d+}")
    public String scheduleNo(HttpServletRequest request, @PathVariable("no") int no){
        String result = null, compId = null, aesKey = null, aesIv = null;
        HttpSession session = null;
        Msg msg = null;

        session = request.getSession();
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");
        msg = getMsg((String)session.getAttribute("lang"));

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            result = schedule2Svc.getScheduleWithNo(compId, no);
            if(result == null)   result = "{\"result\":\"failure\",\"msg\":\"requested schedule is not found.\"}";
            else    result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
        }
        return result;
    } // End of scheduleNo()

    @GetMapping(value = {"company", "company/{from:\\d{13}}", "company/{from:\\d{13}}/{to:\\d{13}}"})
    public String getScheduleCompany(HttpServletRequest request, HttpServletResponse response, @PathVariable(required = false) String from, @PathVariable(required = false) String to){
        return getSchedule(request, response, "company", null, from, to);
    } // End of getScheduleCompany()

    @GetMapping(value = {"dept/{value}", "dept/{value}/{from:\\d{13}}", "dept/{value}/{from:\\d{13}}/{to:\\d{13}}"})
    public String getScheduleDept(HttpServletRequest request, HttpServletResponse response, @PathVariable(required = true) String value, @PathVariable(required = false) String from, @PathVariable(required = false) String to){
        return getSchedule(request, response, "dept", value, from, to);
    } // End of getScheduleDept()
    @GetMapping(value = {"employee", "employee/{value:\\d+}", "employee/{value:\\d+}/{from:\\d{13}}", "employee/{value:\\d+}/{from:\\d{13}}/{to:\\d{13}}"})
    public String getScheduleEmployee(HttpServletRequest request, HttpServletResponse response, @PathVariable(required = false) String value, @PathVariable(required = false) String from, @PathVariable(required = false) String to){
        return getSchedule(request, response, "employee", value, from, to);
    } // End of getScheduleEmployee()


    private String getSchedule(HttpServletRequest request, HttpServletResponse response, String scope, String value, String from, String to){
        String result = null, compId = null, aesKey = null, aesIv = null, userNo = null;
        String html404 = "<!DOCTYPE html><html><head><link rel=\"icon\" href=\"/favicon\" type=\"image/x-icon\"><meta charset=\"UTF-8\"><link rel=\"stylesheet\" type=\"text/css\" href=\"/css/error/error.css\" /><title>404 ERROR!</title></head><body><img src=\"/images/errors/404.jpg\"/></body></html>";
        HttpSession session = null;
        Msg msg = null;
        Integer timeCorrect = 0;

        session = request.getSession();
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        userNo = (String)session.getAttribute("userNo");
        compId = (String)session.getAttribute("compId");
        timeCorrect = (Integer)session.getAttribute("timeCorrect");
        if(compId == null)  compId = (String)request.getAttribute("compId");
        msg = getMsg((String)session.getAttribute("lang"));

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            if(scope.equals("employee") || (scope.equals("dept") && value != null && schedule2Svc.verifyDeptId(compId, value)) || scope.equals("company")){
                result = schedule2Svc.getSchedule(compId, userNo, scope, value, from, to, timeCorrect);
                if(result == null)  result = "{\"result\":\"failure\",\"msg\":\"requested schedule is not found.\"}";
                else{
                    result = encAes(result, aesKey, aesIv);
                    result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
                }
            }else{
                result = html404;
                response.setStatus(404);
            }
            //result = schedule2Svc.getScheduleWithNo(compId, no);
            //if(result == null)   result = "{\"result\":\"failure\",\"msg\":\"requested schedule is not found.\"}";
            //else    result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
        }
        return result;
    } // End of scheduleNo()

    @GetMapping("holiday")
    public String holiday(HttpServletRequest request){
        String result = null, compId = null, aesKey = null, aesIv = null;
        HttpSession session = null;
        Msg msg = null;
        Integer timeCorrect = null;

        session = request.getSession();
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        timeCorrect = (Integer)session.getAttribute("timeCorrect");
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");
        msg = getMsg((String)session.getAttribute("lang"));

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            result = schedule2Svc.getHoliday(timeCorrect == null ? 0 : timeCorrect);
            if(result == null)   result = "{\"result\":\"failure\",\"msg\":\"requested information was not found.\"}";
            else    result = "{\"result\":\"ok\",\"data\":\"" + encAes(result, aesKey, aesIv) + "\"}";
        }
        return result;
    } // End of scheduleNo()

    @GetMapping("/report/{dt:^20\\d{2}-[01]{1}\\d{1}-[0-3]{1}\\d{1}$}")
    public String getWeeklyReport(HttpServletRequest request, @PathVariable String dt){
        String result = null, compId = null, aesKey = null, aesIv = null, userNo = null;
        HttpSession session = null;
        Msg msg = null;
        Integer tc = null;

        session = request.getSession();
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        userNo = (String)session.getAttribute("userNo");
        compId = (String)session.getAttribute("compId");
        tc = (Integer)session.getAttribute("timeCorrect");
        if(compId == null)  compId = (String)request.getAttribute("compId");
        if(tc == null)  tc = 0;
        tc = tc / 60;
        msg = getMsg((String)session.getAttribute("lang"));

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            result = schedule2Svc.getWeeklyReport(compId, userNo, dt, tc);
            if(result == null)   result = "{\"result\":\"failure\",\"msg\":\"requested information was not found.\"}";
            else    result = "{\"result\":\"ok\",\"data\":\"" + encAes(result, aesKey, aesIv) + "\"}";
        }
        return result;
    } // End of scheduleNo()

    @PostMapping("/report/{dt:^20\\d{2}-[01]{1}\\d{1}-[0-3]{1}\\d{1}$}")
    public String postWeeklyReport(HttpServletRequest request, @PathVariable String dt, @RequestBody String requestBody){
        String result = null, compId = null, aesKey = null, aesIv = null, userNo = null, data = null;
        boolean prvUse = false, crntUse = false;
        String prv = null, crnt = null;
        HttpSession session = null;
        JSONObject json = null;
        boolean r = false;
        Msg msg = null;

        session = request.getSession();
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        userNo = (String)session.getAttribute("userNo");
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");
        msg = getMsg((String)session.getAttribute("lang"));

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            data = decAes(requestBody, aesKey, aesIv);
            json = new JSONObject(data);
            prv = json.getString("prv");
            crnt = json.getString("crnt");
            prvUse = json.getBoolean("prvUse");
            crntUse = json.getBoolean("crntUse");
            r = schedule2Svc.updateWeeklyReport(compId, userNo, dt, prv, prvUse, crnt, crntUse);
            if(r)   result = "{\"result\":\"failure\"}";
            else    result = "{\"result\":\"ok\"}";
        }
        return result;
    } // End of scheduleNo()
    
}
