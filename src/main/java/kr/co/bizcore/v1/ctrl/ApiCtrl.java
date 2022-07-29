package kr.co.bizcore.v1.ctrl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class ApiCtrl extends Ctrl {

    @RequestMapping(value = "/dept", method = RequestMethod.GET)
    public String dept(HttpServletRequest request) {
        String result = null, aesKey = null, aesIv = null, json = null, compId = null, userNo;
        HttpSession session = null;

        session = request.getSession();
        userNo = (String)session.getAttribute("userNo");
        compId = (String)session.getAttribute("compId");
        if(compId == null){
            compId = (String)request.getAttribute("compId");
        }
        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else if(userNo == null){
            result = "{\"result\":\"failure\",\"msg\":\"Session expired or Not logged in.\"}";
        }else{
            aesKey = (String)session.getAttribute("aesKey");
            aesIv = (String)session.getAttribute("aesIv");
            if(aesKey == null || aesIv == null){
                result = "{\"result\":\"failure\",\"msg\":\"Not found AES key.\"}";
            }else{
                json = deptService.getDeptJson(compId);
                json = deptService.encAes(json, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + json + "\"}";
            }
        }
        return result;
    } // End of dept

    @RequestMapping(value = "/my/*", method = RequestMethod.GET)
    public String myGet(HttpServletRequest request) {
        String result = null, aesKey = null, aesIv = null, compId = null, userNo, uri = null, pw = null;
        HttpSession session = null;

        session = request.getSession();
        userNo = (String)session.getAttribute("userNo");
        compId = (String)session.getAttribute("compId");
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        if(compId == null)  compId = (String)request.getAttribute("compId");
        uri = request.getRequestURI();

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else if(uri.length() <= 8){
            result = "{\"result\":\"failure\",\"msg\":\"Need Pssword.\"}";
        }else if(aesIv == null || aesKey == null){
            result = "{\"result\":\"failure\",\"msg\":\"Not found AES key.\"}";
        }else{
            pw = uri.substring(8);
            pw = userService.decAes(pw, aesKey, aesIv);
            result = systemService.getMyInfo(userNo, pw, compId);
            if(result == null){
                result = "{\"result\":\"failure\",\"msg\":\"Invalid password.\"}";
            }else{
                result = systemService.encAes(result, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
            }
        }

        return result;
    } // End of dept

    // 개인정보 수정
    @RequestMapping(value = "/my", method = RequestMethod.POST)
    public String myPost(HttpServletRequest request, @RequestBody String requestBody) {
        String result = null, aesKey = null, aesIv = null, compId = null, userNo, phone = null, email, str = null;
        JSONObject json = null;
        HttpSession session = null;

        session = request.getSession();
        userNo = (String)session.getAttribute("userNo");
        compId = (String)session.getAttribute("compId");
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else if(aesIv == null || aesKey == null){
            result = "{\"result\":\"failure\",\"msg\":\"Not found AES key.\"}";
        }else{
            str = systemService.decAes(requestBody, aesKey, aesIv);
            json = new JSONObject(str);
            email = json.getString("email");
            phone = json.getString("phone");
            systemService.modifyMyInfo(compId, userNo, email, phone);
            result = "{\"result\":\"ok\"}";
           
        }

        return result;
    } // End of myPost()

    // 비번 변경
    @RequestMapping(value = "/my", method = RequestMethod.PUT)
    public String myPut(HttpServletRequest request, @RequestBody String requestBody) {
        String result = null, aesKey = null, aesIv = null, compId = null, userNo, pwOld = null, pwNew, str = null;
        JSONObject json = null;
        HttpSession session = null;

        session = request.getSession();
        userNo = (String)session.getAttribute("userNo");
        compId = (String)session.getAttribute("compId");
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else if(aesIv == null || aesKey == null){
            result = "{\"result\":\"failure\",\"msg\":\"Not found AES key.\"}";
        }else{
            str = systemService.decAes(requestBody, aesKey, aesIv);
            json = new JSONObject(str);
            pwOld = json.getString("old");
            pwNew = json.getString("new");
            systemService.modifyPassword(pwOld, pwNew, userNo, compId);
            result = "{\"result\":\"ok\"}";




        }

        return result;
    } // End of myPut()

}
