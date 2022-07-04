package kr.co.bizcore.v1.ctrl;

import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.PublicKey;
import java.security.spec.RSAPublicKeySpec;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import kr.co.bizcore.v1.domain.User;

@RestController
@RequestMapping("/api")
public class ApiCtrl extends Ctrl {

    @RequestMapping(value = "/dept", method = RequestMethod.GET)
    public String deptGet() {

        return null;
    } // End of dept

    @RequestMapping(value = "/dept", method = RequestMethod.POST)
    public String deptPost() {

        return null;
    } // End of dept

    @RequestMapping("/user")
    public String user(HttpServletRequest request, HttpServletResponse response) {

        return null;
    } // End of user()

    // Login process API
    @RequestMapping(value = "/user/login", method = RequestMethod.POST)
    public String userLogin(HttpServletRequest request) {
        String userId = null, pw = null, userNo = null, compId = null, formData = null, result = null;
        HttpSession session = null;
        User user = null;

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

        if (compId == null) { // compId NOT Verified, send failure message
            result = "{\"result\":\"failure\",\"msg\":\"Company ID isn't verified\"}";
        } else { // When compId verified, decryption data and verify userId, pw.
            session.setAttribute("compId", compId); // Set attribute compId to session
            formData = request.getParameter("data");
            userId = request.getParameter("userId");
            pw = request.getParameter("pw");
            if (userId == null || pw == null) {
                result = "{\"result\":\"failure\",\"msg\":\"User ID and/or Password ware empty\"}";
            } else {
                userNo = userService.verifyLogin(compId, userId, pw);
                if (userNo == null)
                    result = "{\"result\":\"failure\",\"msg\":\"User ID and/or Password ware mismatch\"}";
                else {
                    user = userService.getBasicUserInfo(userNo);
                    result = "{\"result\":\"ok\",\"data\":" + user.toJson() + "}";
                    userService.setPermission(user);
                    session.setAttribute("userNo", userNo);
                    session.setAttribute("user", user);
                }
            }
        }
        // Later, AES applied
        result = util.encAes(result);

        return result;
    } // End of userLogin()

    // Logged out process API
    @RequestMapping(value = "/user/logout", method = RequestMethod.GET)
    public RedirectView userLogout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession();
        session.invalidate();
        return new RedirectView("/");
    } // End of userLogout()

    // RSA Public key request API
    @RequestMapping(value = "/user/rsa", method = RequestMethod.GET)
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
            keyPair = userService.createRsaKeyPair();
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
                result = "{\"result\":\"ok\",\"data\":{\"publicKeyModulus\":\"" + publicKeyModulus
                        + "\",\"publicKeyExponent\":\"" + publicKeyExponent + "\"}}";
            } catch (Exception e) {
                result = "{\"result\":\"failure\",\"msg\":\"Error occurred when get RSA public key.\"}";
                e.printStackTrace();
            }
        }
        return result;
    } // End of userRsa()

    @RequestMapping("/customer")
    public String customer(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/product")
    public String product(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/schedule")
    public String schedule(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/calendar")
    public String calendar(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/sales")
    public String sales(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/contract")
    public String contract(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/support")
    public String support(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/procure")
    public String procure(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/filebox")
    public String filebox(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/hr")
    public String hr(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/appr")
    public String appr(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/form")
    public String form(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/docbox")
    public String docbox(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/bankacc")
    public String bankacc(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/card")
    public String card(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/common")
    public String common(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/my")
    public String my(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/vacation")
    public String vacation(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/accslip")
    public String accslip(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/workreport")
    public String workreport(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/bbs")
    public String bbs(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

}
