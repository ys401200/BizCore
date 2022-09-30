package kr.co.bizcore.v1.ctrl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.websocket.server.PathParam;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.bizcore.v1.msg.Msg;
import kr.co.bizcore.v1.svc.NotesService;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/note")
@Slf4j
public class ApiNoteCtrl extends Ctrl{

    private static final Logger logger = LoggerFactory.getLogger(ApiNoteCtrl.class);

    @GetMapping("")
    public String get(HttpServletRequest request){
        String result = null, compId = null, data = null, aesKey = null, aesIv = null, userNo = null;
        HttpSession session = null;
        Msg msg = null;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        userNo = (String) session.getAttribute("userNo");
        msg = getMsg((String)session.getAttribute("lang"));
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");
        msg = getMsg((String)session.getAttribute("lang"));

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            data = notes.getNewCount(compId, userNo);
            data = encAes(data, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
        }

        return result;
    } // End of get()

    @GetMapping("/{partner:\\d+}/{time:\\d+}")
    public String getMessage(HttpServletRequest request, @PathVariable("partner") int partner, @PathVariable("time") long time){
        String result = null, compId = null, data = null, aesKey = null, aesIv = null, userNo = null;
        HttpSession session = null;
        Msg msg = null;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        userNo = (String) session.getAttribute("userNo");
        msg = getMsg((String)session.getAttribute("lang"));
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");
        msg = getMsg((String)session.getAttribute("lang"));

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            data = notes.getMessage(compId, userNo, partner, time);
            data = encAes(data, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
        }

        return result;
    } // End of getMessage()

    @GetMapping("/{partner:\\d+}")
    public String getNewMessage(HttpServletRequest request, @PathVariable("partner") int partner){
        String result = null, compId = null, data = null, aesKey = null, aesIv = null, userNo = null;
        HttpSession session = null;
        Msg msg = null;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        userNo = (String) session.getAttribute("userNo");
        msg = getMsg((String)session.getAttribute("lang"));
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");
        msg = getMsg((String)session.getAttribute("lang"));

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            data = notes.getNewMessage(compId, userNo, partner);
            data = encAes(data, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
        }

        return result;
    } // End of getNewMessage()

    @PostMapping("/{partner:\\d+}")
    public String sendNewMessage(HttpServletRequest request, @PathVariable("partner") int partner, @RequestBody String requestBody){
        String result = null, compId = null, data = null, aesKey = null, aesIv = null, userNo = null;
        HttpSession session = null;
        JSONObject json = null;
        String message = null;
        String related = null;
        Msg msg = null;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        userNo = (String) session.getAttribute("userNo");
        msg = getMsg((String)session.getAttribute("lang"));
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
            message = json.getString("msg");
            related = json.isNull("related") ? null : json.getJSONObject("related").toString();
            notes.sendNewNotes(compId, partner, strToInt(userNo), message, related);            
            result = "{\"result\":\"ok\"}";
        }

        return result;
    } // End of sendNewMessage()
    
}
