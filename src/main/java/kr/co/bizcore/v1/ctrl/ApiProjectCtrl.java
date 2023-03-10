package kr.co.bizcore.v1.ctrl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.DeleteMapping;
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
import kr.co.bizcore.v1.domain.Sopp2;
import kr.co.bizcore.v1.mapper.ProjectMapper;
import kr.co.bizcore.v1.msg.Msg;
import kr.co.bizcore.v1.svc.ProjectService;
import lombok.extern.slf4j.Slf4j;

@RequestMapping("/api/project")
@RestController
@Slf4j
public class ApiProjectCtrl extends Ctrl{

    private static final Logger logger = LoggerFactory.getLogger(ApiProjectCtrl.class);

    @GetMapping("")
    public String projectGet(HttpServletRequest request){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        Msg msg = null;
        HttpSession session = null;

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
            result = projSvc.getProjects(compId);
            result = boardService.encAes(result, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
        }
        
        return result;
    } // End of projectGet()

    @PostMapping("")
    public String projectPost(HttpServletRequest request, @RequestBody String requestBody) throws JsonMappingException, JsonProcessingException{
        String result = null;
        String compId = null, aesKey = null, aesIv = null, data = null;
        ObjectMapper mapper = null;
        Project prj = null;
        int r = -999;
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
            prj = mapper.readValue(data, Project.class);
            r = projSvc.updateProject(compId, prj);
            if(r == -999)   result = "{\"result\":\"failure\",\"msg\":\"project is null.\"}";
            else if(r < 1)  result = "{\"result\":\"failure\",\"msg\":\"update count is zero.\"}";
            else    result = "{\"result\":\"ok\",\"data\":\"" + r + "\"}";
        }
        
        return result;
    } // End of projectNoGet()

    @DeleteMapping("/{no:\\d+}")
    public String projectNoDelete(HttpServletRequest request, @PathVariable("no") int no){
        String result = null;
        String compId = null, data = null;
        Msg msg = null;
        HttpSession session = null;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)session.getAttribute("compId");
        msg = getMsg((String)session.getAttribute("lang"));

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else{
            data = projSvc.removeProject(compId, no);
            if(data == null)    result = "{\"result\":\"failure\",\"msg\":\"" + msg.unknownError + "\"}";
            else if(data.equals("ok"))  result = "{\"result\":\"ok\",\"data\":" + no + "}";
            else                result = "{\"result\":\"failure\",\"msg\":\"" + data + "\"}";
        }
        
        return result;
    } // End of projectNoDelete()

    @GetMapping("/sopp")
    public String soppGet(HttpServletRequest request){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        Msg msg = null;
        HttpSession session = null;

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
            result = projSvc.getSoppList(compId);
            result = boardService.encAes(result, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
        }
        
        return result;
    } // End of projectGet()

    @GetMapping("/sopp/{no:\\d+}")
    public String soppNoGet(HttpServletRequest request, @PathVariable("no") int no){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        Msg msg = null;
        HttpSession session = null;

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
            result = projSvc.getSopp2(compId, no);
            if(result != null){
                result = boardService.encAes(result, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";    
            }else{
                result = "{\"result\":\"failure\",\"msg\":\"Requested sopp is not exist\"}";
            }
        }
        
        return result;
    } // End of projectGet()

    @PostMapping("/sopp")
    public String projectSoppPost(HttpServletRequest request, @RequestBody String requestBody) throws JsonMappingException, JsonProcessingException{
        String result = null;
        String compId = null, aesKey = null, aesIv = null, data = null, userNo = null;
        ObjectMapper mapper = null;
        Sopp2 sopp = null, r = null;
        Msg msg = null;
        HttpSession session = null;

        mapper = new ObjectMapper();
        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)session.getAttribute("compId");
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        userNo = (String)session.getAttribute("userNo");
        msg = getMsg((String)session.getAttribute("lang"));

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            data = decAes(requestBody, aesKey, aesIv);
            sopp = mapper.readValue(data, Sopp2.class);
            r = projSvc.updateSopp(compId, sopp, userNo);
            if(r != null){
                result = r.toJson();
                result = "{\"result\":\"ok\",\"data\":\"" + encAes(result, aesKey, aesIv) + "\"}";
            }else            result = "{\"result\":\"failure\",\"msg\":\"update fail.\"}";
        }
        
        return result;
    } // End of projectSoppPost()

    @PostMapping("/sopp/chat/{sopp:\\d+}/{stage:\\d+}")
    public String projectSoppChatNoPost(HttpServletRequest request, @RequestBody String requestBody, @PathVariable("sopp") int sopp, @PathVariable("stage") int stage) {
        String result = null;
        String compId = null, aesKey = null, aesIv = null, data = null, userNo = null;
        Msg msg = null;
        HttpSession session = null;
        int r = -999;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)session.getAttribute("compId");
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        userNo = (String)session.getAttribute("userNo");
        msg = getMsg((String)session.getAttribute("lang"));

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            data = decAes(requestBody, aesKey, aesIv);
            r = projSvc.addSoppChat(compId, sopp, false, strToInt(userNo), stage, data);
            if(r > 0)   result = "{\"result\":\"ok\",\"data\":" + r + "}";
            else        result = "{\"result\":\"failure\"}";
        }
        
        return result;
    } // End of projectSoppPost()

    @DeleteMapping("/sopp/chat/{idx:\\d+}")
    public String projectSoppChatIdxDelete(HttpServletRequest request, @PathVariable("idx") int idx) {
        String result = null;
        String compId = null, aesKey = null, aesIv = null, userNo = null;
        Msg msg = null;
        HttpSession session = null;
        int r = -999;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)session.getAttribute("compId");
        userNo = (String)session.getAttribute("userNo");
        msg = getMsg((String)session.getAttribute("lang"));

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else{
            r = projSvc.removeSoppChat(compId, userNo, idx);
            if(r > 0)   result = "{\"result\":\"ok\"}";
            else        result = "{\"result\":\"failure\"}";
        }
        
        return result;
    } // End of projectSoppChatIdxDelete()

    // ==================================== S C H E D U L E ================================================

    @PostMapping("schedule")
    public String projectSchedulePost(HttpServletRequest request, @RequestBody String requestBody) throws JsonMappingException, JsonProcessingException{
        String result = null;
        String compId = null, aesKey = null, aesIv = null, data = null, userNo = null;
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
        userNo = (String)session.getAttribute("userNo");
        msg = getMsg((String)session.getAttribute("lang"));

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            data = decAes(requestBody, aesKey, aesIv);
            sch = mapper.readValue(data, Schedule2.class);
            r = projSvc.updateSchedule2(compId, sch, userNo);
            if(r != null){
                //result = r.toJson();
                result = "{\"result\":\"ok\",\"data\":\"" + encAes(result, aesKey, aesIv) + "\"}";
            }else            result = "{\"result\":\"failure\",\"msg\":\"update fail.\"}";
        }



        return result;
    } // End of projectSchedulePost()
    
}
