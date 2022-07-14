package kr.co.bizcore.v1.ctrl;

import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.PublicKey;
import java.security.spec.RSAPublicKeySpec;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;
import java.io.UnsupportedEncodingException;

import kr.co.bizcore.v1.domain.SimpleUser;

@RestController
@RequestMapping("/api/user")
public class ApiUserCtrl extends Ctrl{

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
        String userId = null, pw = null, userNo = null, compId = null, result = null, uri = null, dec = null,
                aesKey = null, aesIv = null;
        String[] t = null;
        boolean keepStatus = false;
        JSONObject json = null;
        HttpSession session = null;

        // 경로에서 compId를 찾을 수 있도록 준비함
        uri = request.getRequestURI();
        if (uri.substring(0, 1).equals("/"))
            uri = uri.substring(1);
        if (uri.substring(uri.length() - 1).equals("/"))
            uri = uri.substring(0, uri.length() - 1);

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
            result = "{\"result\":\"failure\",\"msg\":\"Company ID isn't verified\"}";
        } else { // When compId verified, decryption data and verify userId, pw.
            session.setAttribute("compId", compId); // Set attribute compId to session
            aesKey = (String) session.getAttribute("aesKey");
            aesIv = (String) session.getAttribute("aesIv");
            dec = userService.decAes(requestBody, aesKey, aesIv);
            json = new JSONObject(dec);

            userId = json.getString("userId");
            pw = json.getString("pw");
            keepStatus = json.getBoolean("keepStatus");
            if (userId == null || pw == null) {
                result = "{\"result\":\"failure\",\"msg\":\"User ID and/or Password ware empty\"}";
            } else {
                userNo = userService.verifyLogin(compId, userId, pw);
                if (userNo == null)
                    result = "{\"result\":\"failure\",\"msg\":\"User ID and/or Password ware mismatch\"}";
                else {
                    session.setAttribute("userNo", userNo);
                    result = "{\"result\":\"ok\"}";
                }
            }
        }

        return result;
    } // End of userLogin()

    // Logged out process API
    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public RedirectView userLogout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession();
        session.invalidate();
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
