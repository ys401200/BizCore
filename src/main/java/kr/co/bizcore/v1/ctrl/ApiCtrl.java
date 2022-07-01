package kr.co.bizcore.v1.ctrl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

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

    @RequestMapping(value = "/user/login", method = RequestMethod.POST)
    public String userLogin(HttpServletRequest request) {
        String userId = null, pw = null, userNo = null, compId = null, formData = null, result = null;
        HttpSession session = null;
        User user = null;

        session = request.getSession();
        if (session != null)
            compId = (String) session.getAttribute("compId"); // 세션에 저장된 compId를 가져옴
        if (compId == null)
            compId = (String) request.getAttribute("compId"); // 세션에서 compId 확인 불가시 request에서 한 번 더 시도함

        if (compId == null) { // compId 확인이 안 되는 경우
            result = "{\"result\":\"failure\",\"msg\":\"Company ID isn't verified\"}";
        } else { // compId 확인이 되는 경우
            session.setAttribute("compId", compId); // session에 compId 저장
            userId = request.getParameter("userId");
            pw = request.getParameter("pw");
            if (userId == null || pw == null) {
                result = "{\"result\":\"failure\",\"msg\":\"User ID and/or Password ware empty\"}";
            } else {
                userNo = systemService.verifyLogin(compId, userId, pw);
                if (userNo == null)
                    result = "{\"result\":\"failure\",\"msg\":\"User ID and/or Password ware mismatch\"}";
                else {
                    user = userService.getBasicUserInfo(userNo);
                    result = "{\"result\":\"ok\",\"data\":" + user.toJson() + "}";
                    systemService.setPermission(user);
                    session.setAttribute("userNo", userNo);
                    session.setAttribute("user", user);
                }
            }
        }
        // AES 암호화
        result = util.encAes(result);

        return result;
    } // End of userLogin()

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
