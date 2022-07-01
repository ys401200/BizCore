package kr.co.bizcore.v1.ctrl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping(value = "/", method = RequestMethod.GET)
public class RootController extends Ctrl {

    // 泥� �솕硫� / 濡쒓렇�씤 �뿬遺� 諛� compId �솗�씤 �뿬遺��뿉 �뵲�씪 �떖由� �굹���굹�룄濡� �븿
    @RequestMapping("")
    public String root(HttpServletRequest request) {
        String compId = null, userNo = null;
        HttpSession session = null;
        String result = null;

        session = request.getSession();
        compId = (String) session.getAttribute("compId");
        if (compId == null)
            request.getAttribute("compId");

        if (compId != null && userNo != null) {
            result = "bodyContents";
        } else if (userNo != null && compId == null) {
            result = "bodyContents";
        } else {
            result = "/login/login";
        }

        return result;
    }

}
