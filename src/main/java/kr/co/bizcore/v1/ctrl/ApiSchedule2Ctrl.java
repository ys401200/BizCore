package kr.co.bizcore.v1.ctrl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.bizcore.v1.domain.Project;
import kr.co.bizcore.v1.domain.Schedule2;
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
    
}
