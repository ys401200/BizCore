package kr.co.bizcore.v1.ctrl;

import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.PublicKey;
import java.security.spec.RSAPublicKeySpec;

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
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;

import kr.co.bizcore.v1.domain.SimpleUser;
import kr.co.bizcore.v1.msg.Msg;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/user")
@Slf4j
public class ApiUserCtrl extends Ctrl{

    private static final Logger logger = LoggerFactory.getLogger(ApiUserCtrl.class);

    @RequestMapping(value = "", method = RequestMethod.GET)
    public String user(HttpServletRequest request) {
        String result = null, aesKey = null, aesIv = null;
        SimpleUser user = null;
        HttpSession session = null;

        session = request.getSession();
        if(session == null){ // 유효한 세션이 있는지 검증
            result = "{\"result\":\"failure\",\"msg\":\"Session is expired.\"}";
        }else{ // 세션이 유효한 경우 user 객체를 가지고 옴
            user = (SimpleUser)session.getAttribute("user");
            if(user == null){ // user객체가 있는지 검증
                result = "{\"result\":\"failure\",\"msg\":\"login is expired.\"}";
            }else{ //  user 객체를 json으로 변환하고 AES256으로 암호화 함
                aesKey = (String)session.getAttribute("aesKey");
                aesIv = (String)session.getAttribute("aesIv");
                if(aesKey == null || aesIv == null){ // AES 암호화를 할 수 있는 키가 있는지 검증함
                    result = "{\"result\":\"failure\",\"msg\":\"AES Key is invalid..\"}";
                }else{
                    result = userService.encAes(user.toJson(), aesKey, aesIv);
                    result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
                }
            }
        }
        return result;
    } // End of api/user == get

    // Login process API
    @RequestMapping(value = "/login/*", method = RequestMethod.POST)
    public String userLogin(HttpServletRequest request, @RequestBody String requestBody) {
        String userId = null, pw = null, userNo = null, compId = null, result = null, uri = null;
        String dec = null, aesKey = null, aesIv = null, lang = null, keepToken = null;
        String[] t = null;
        Msg msg = null;
        boolean keep = false;
        JSONObject json = null;
        HttpSession session = null;

        session = request.getSession();
        lang = (String)session.getAttribute("lang");
        msg = getMsg(lang);

        // 경로에서 compId를 찾을 수 있도록 준비함
        uri = request.getRequestURI();
        if (uri.substring(0, 1).equals("/"))
            uri = uri.substring(1);
        if (uri.substring(uri.length() - 1).equals("/"))
            uri = uri.substring(0, uri.length() - 1);
        t = uri.split("/");

        // session과 request에서 compId를 찾아봄
        session = request.getSession();
        if (session != null)
            compId = (String) session.getAttribute("compId"); // First, verify compId from session(it's login process
                                                              // base)
        if (compId == null)
            compId = (String) request.getAttribute("compId"); // Second, verify compId from request(it's url base, Not
                                                              // user input)
        if (compId == null)
            compId = (String) request.getParameter("compId"); // Third, verify compId from post parameter(it's post
                                                              // base, user inputed)
        if (compId == null && t.length > 3)
            compId = t[3];

        if (compId == null) { // compId NOT Verified, send failure message
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        } else { // When compId verified, decryption data and verify userId, pw.
            session.setAttribute("compId", compId); // Set attribute compId to session
            aesKey = (String) session.getAttribute("aesKey");
            aesIv = (String) session.getAttribute("aesIv");
            dec = userService.decAes(requestBody, aesKey, aesIv);
            json = new JSONObject(dec);

            userId = json.getString("userId");
            pw = json.getString("pw");
            keep = json.getBoolean("keepStatus");
            if (userId == null || pw == null) {
                result = "{\"result\":\"failure\",\"msg\":\"" + msg.idPwMisMatch + "\"}";
            } else {
                t = userService.verifyLoginTemp(compId, userId, pw, keep);
                userNo = t[0];
                keepToken = t[1];
                if (userNo == null)
                    result = "{\"result\":\"failure\",\"msg\":\"" + msg.idPwMisMatch + "\"}";
                else {
                    session.setAttribute("userNo", userNo);
                    result = "{\"result\":\"ok\",\"data\":\"" + keepToken + "\"}";
                    //로그인 상태 유지를 체크한 경우 세션의 유효시간을 연장하도록 함
                    if(keep)    session.setMaxInactiveInterval(86400);
                    else        session.setMaxInactiveInterval(3600);
                }
            }
        }

        return result;
    } // End of userLogin()


    // 로그인 상태 확인 메서드
    @PostMapping("/keep")
    public String apiUserKeepPost(HttpServletRequest request, @RequestBody String requestBody){
        String result = null;
        String compId = null, aesKey = null, aesIv = null, keepToken = null, userNo = null;
        String[] data = null, aes = null;
        HttpSession session = null;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(requestBody == null) return "{\"result\":\"failure\"}";
        
        data = requestBody.split("=");
        if(data == null || data.length != 2 || data[0] == null || data[1] == null || (compId != null && !data[0].equals(compId))) return "{\"result\":\"failure\"}";
        compId = data[0];

        aes = systemService.getCompanyAesKey(compId);
        if(aes == null || aes[0] == null || aes[1] == null) return "{\"result\":\"failure\"}";
        aesKey = aes[0];
        aesIv = aes[1];

        keepToken = data[1];
        keepToken = decAes(keepToken, aesKey, aesIv);
        if(keepToken == null) return "{\"result\":\"failure\"}";

        userNo = systemService.getKeepLoginUser(compId, keepToken);
        if(userNo == null)  result = "{\"result\":\"failure\"}";
        else{
            session.setAttribute("userNo", userNo);
            session.setAttribute("compId", compId);
            result = "{\"result\":\"ok\"}";
        }

        return result;
    }

    @RequestMapping(value = "/map", method = RequestMethod.GET)
    public String userMap(HttpServletRequest request) {
        String result = null, aesKey = null, aesIv = null, map = null, compId = null;
        
        HttpSession session = request.getSession();

        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
        }else{
            map = userService.getUserMapJson(compId);
            map = userService.encAes(map, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + map + "\"}";
        }

        return result;
    }

    @RequestMapping(value = "/rank", method = RequestMethod.GET)
    public String userRank(HttpServletRequest request) {
        String result = null, aesKey = null, aesIv = null, data = null, compId = null;
        
        HttpSession session = request.getSession();

        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
        }else{
            data = userService.getUserRank(compId);
            data = encAes(data, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
        }

        return result;
    }

    @GetMapping("/personalize")
    public String personalizeGet(HttpServletRequest request){
        String result = null, userNo = null, data = null, compId = null;
        
        HttpSession session = request.getSession();

        userNo = (String)session.getAttribute("userNo");
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else{
            data = userService.getPersonalize(compId, userNo);
            if(data != null)    result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
            else                result = "{\"result\":\"failure\"}";
        }

        return result;
    } // End of personalizeGet

    @PostMapping("/personalize")
    public String personalizePost(HttpServletRequest request, @RequestBody String requestBody){
        String result = null, userNo = null, compId = null;
        
        HttpSession session = request.getSession();

        userNo = (String)session.getAttribute("userNo");
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else if(requestBody == null || requestBody.equals("")){
            result = "{\"result\":\"failure\"}";
        }else{
            if(userService.setPersonalize(compId, userNo, requestBody) > 0)    result = "{\"result\":\"ok\"}";
            else                result = "{\"result\":\"failure\"}";
        }

        return result;
    } // End of personalizePost()

    @RequestMapping(value = "/image/{no:\\d+}", method = RequestMethod.GET)
    public void myImageGet(HttpServletRequest request, @PathVariable int no, HttpServletResponse response) throws IOException {
        String compId = null;
        HttpSession session = null;
        byte[] result = null;
        OutputStream os = null;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            response.setStatus(404);
        }else{
            result = attachedService.getUserImage(compId, no+"");
            response.setContentType("image/png");
            os = response.getOutputStream();
            os.write(result);
            os.flush();
        }
    } // End of myImageGet()

    // Logged out process API
    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public RedirectView userLogout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession();
        String compId = null, userNo = null;

        userNo = (String)session.getAttribute("userNo");
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        session.invalidate();
        if(userNo != null && compId != null)    systemService.removeKeepInfo(compId, userNo);
        return new RedirectView("/");
    } // End of userLogout()

    // RSA Public key request API
    @RequestMapping(value = "/rsa", method = RequestMethod.GET)
    public String userRsa(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = null;
        KeyPair keyPair = null;
        PublicKey publicKey = null;
        RSAPublicKeySpec publicSpec = null;
        KeyFactory keyFactory = null;
        String publicKeyModulus = null;
        String publicKeyExponent = null;
        String result = null;

        session = request.getSession();
        keyPair = (KeyPair) session.getAttribute("rsaKey");

        if (keyPair == null) { // RSA 키 쌍이 없는 경우 새로 생성하도록 함
            keyPair = userService.genKeyPair();
            session.setAttribute("rsaKey", keyPair);
        }

        if (keyPair == null) {
            result = "{\"result\":\"failure\",\"msg\":\"Error occurred when create RSA key pair.\"}";
        } else {
            try {
                publicKey = keyPair.getPublic();
                keyFactory = KeyFactory.getInstance("RSA");
                publicSpec = (RSAPublicKeySpec) keyFactory.getKeySpec(publicKey, RSAPublicKeySpec.class);
                publicKeyModulus = publicSpec.getModulus().toString(16);
                publicKeyExponent = publicSpec.getPublicExponent().toString(16);
                result = "{\"result\":\"ok\",\"data\":{\"publicKeyModulus\":\""
                        + publicKeyModulus
                        + "\",\"publicKeyExponent\":\"" + publicKeyExponent + "\"}}";
            } catch (Exception e) {
                result = "{\"result\":\"failure\",\"msg\":\"Error occurred when get RSA public key.\"}";
                e.printStackTrace();
            }
        }
        return result;
    } // End of userRsa()

    @RequestMapping(value = "/aes", method = RequestMethod.POST)
    public String userAes(HttpServletRequest request, @RequestBody String requestBody)
            throws UnsupportedEncodingException {
        String aesKey = null, iv = null;
        String[] t = null;
        KeyPair keyPair = null;
        HttpSession session = null;

        session = request.getSession();
        keyPair = (KeyPair) session.getAttribute("rsaKey");
        t = requestBody.split("\n");
        aesKey = userService.decRsa(t[0], keyPair);
        aesKey += userService.decRsa(t[1], keyPair);
        aesKey += userService.decRsa(t[2], keyPair);
        aesKey += userService.decRsa(t[3], keyPair);
        iv = userService.decRsa(t[4], keyPair);
        iv += userService.decRsa(t[5], keyPair);
        session.setAttribute("aesKey", aesKey);
        session.setAttribute("aesIv", iv);
        return "{\"result\":\"ok\"}";
    }
    
}
