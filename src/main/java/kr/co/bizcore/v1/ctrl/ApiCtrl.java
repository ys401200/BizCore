package kr.co.bizcore.v1.ctrl;

import java.io.IOException;
import java.io.OutputStream;
import java.util.Base64;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import kr.co.bizcore.v1.domain.User;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
@Slf4j
public class ApiCtrl extends Ctrl {

    private static final Logger logger = LoggerFactory.getLogger(ApiCtrl.class);

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

    @RequestMapping(value = "/my/{pw}", method = RequestMethod.GET)
    public String myGet(HttpServletRequest request, @PathVariable String pw) {
        String result = null, aesKey = null, aesIv = null, compId = null, userNo, uri = null;
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
            pw = decAes(pw, aesKey, aesIv);
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
        String result = null, aesKey = null, aesIv = null, compId = null, userNo = null, data = null;
        String email = null, address = null, homePhone = null, cellPhone = null;
        Integer zipCode = -1;
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
            data = decAes(requestBody, aesKey, aesIv);
            json = new JSONObject(data);
            email = json.getString("email");
            address = json.getString("address");
            homePhone = json.getString("homePhone");
            cellPhone = json.getString("cellPhone");
            zipCode = json.getInt("zipCode");
            systemService.modifyMyInfo(compId, userNo, email, address, homePhone, cellPhone, zipCode);
            result = "{\"result\":\"ok\"}";
        }

        return result;
    } // End of myPost()

    // 개인정보 수정 중 사진 업로드시 임시저장
    @RequestMapping(value = "/my/image", method = RequestMethod.POST)
    public String myImagePost(HttpServletRequest request, @RequestBody String requestBody) {
        String result = null, aesKey = null, aesIv = null, compId = null, userNo = null, data = null;
        byte[] fileData = null;
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
            data = decAes(requestBody, aesKey, aesIv);
            fileData = Base64.getDecoder().decode(data);
            if(attachedService.saveMyImageToTemp(compId, userNo, fileData)) result = "{\"result\":\"ok\"}";
            else    result = "{\"result\":\"failure\",\"msg\":\"An error occurred.\"}";
        }

        return result;
    } // End of myImagePost()

    @RequestMapping(value = "/my/image", method = RequestMethod.GET)
    public void myImageGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String compId = null, userNo = null;
        HttpSession session = null;
        byte[] result = null;
        OutputStream os = null;

        session = request.getSession();
        userNo = (String)session.getAttribute("userNo");
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            response.setStatus(404);
        }else{
            result = attachedService.getUserImage(compId, userNo);
            response.setContentType("image/png");
            os = response.getOutputStream();
            os.write(result);
            os.flush();
        }
    } // End of myImageGet()

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
