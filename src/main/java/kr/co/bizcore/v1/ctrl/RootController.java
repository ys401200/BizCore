package kr.co.bizcore.v1.ctrl;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping(value = "/", method = RequestMethod.GET)
public class RootController extends Ctrl {
    private static final String VIEW_PATH = null;
    private static final String VIEW_ERROR_PATH = "/error/";

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
    
    @RequestMapping(value = "/error")
    public String handleError(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);

        if(status != null){
            int statusCode = Integer.valueOf(status.toString());

            if(statusCode == HttpStatus.NOT_FOUND.value()){
                return VIEW_ERROR_PATH + "404";
            }
            if(statusCode == HttpStatus.FORBIDDEN.value()){
                return VIEW_ERROR_PATH + "500";
            }
        }
        return "error";
    }
}
