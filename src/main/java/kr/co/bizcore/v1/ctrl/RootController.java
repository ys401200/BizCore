package kr.co.bizcore.v1.ctrl;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import kr.co.bizcore.v1.domain.User;

@Controller
@RequestMapping(value = "/", method = RequestMethod.GET)
public class RootController extends Ctrl {
    private static final String VIEW_PATH = null;
    private static final String VIEW_ERROR_PATH = "/error/";

	// 泥� �솕硫� / 濡쒓렇�씤 �뿬遺� 諛� compId �솗�씤 �뿬遺��뿉 �뵲�씪 �떖由� �굹���굹�룄濡� �븿
    @RequestMapping("")
    public String root(HttpServletRequest request) {
        HttpSession session = null;
        String result = null;

        session = request.getSession();
        session.setAttribute("pathName", "root");
        User user = (User) session.getAttribute("user");

        if (user != null) {
            result = "bodyContents";
        } else {
            result = "/login/login";
        }

        return result;
    } // End of root

    @RequestMapping("/business/**")
    public String business(HttpServletRequest request) {
        HttpSession session = null;
        String result = null, uri = null, pathName = null, tempStr = null;
        String[] tempStrArr = null;

        session = request.getSession();
        User user = (User) session.getAttribute("user");
        uri = request.getRequestURI();

        if (uri.substring(0, 1).equals("/"))
            uri = uri.substring(1);
        if (uri.substring(uri.length() - 1).equals("/"))
            uri = uri.substring(0, uri.length() - 1);

        tempStrArr = uri.split("/");
        if(tempStrArr.length == 0){
            pathName = "root";
        }else if(tempStrArr.length == 1){
            pathName = tempStrArr[0];
        }else if(tempStrArr.length > 1){
            tempStr = tempStrArr[1];
            pathName = tempStrArr[0];
            pathName += tempStr.substring(0, 1).toUpperCase();
            pathName += tempStr.substring(1).toLowerCase();
        }

        session.setAttribute("pathName", "root");

        if (user != null) {
            result = "bodyContents";
        } else {
            result = "/login/login";
        }

        return result;
    } // End of /business/**/*

    @RequestMapping("/gw/**")
    public String gw(HttpServletRequest request) {
        HttpSession session = null;
        String result = null, uri = null, pathName = null, tempStr = null;
        String[] tempStrArr = null;

        session = request.getSession();
        User user = (User) session.getAttribute("user");
        uri = request.getRequestURI();

        if (uri.substring(0, 1).equals("/"))
            uri = uri.substring(1);
        if (uri.substring(uri.length() - 1).equals("/"))
            uri = uri.substring(0, uri.length() - 1);

        tempStrArr = uri.split("/");
        if(tempStrArr.length == 0){
            pathName = "root";
        }else if(tempStrArr.length == 1){
            pathName = tempStrArr[0];
        }else if(tempStrArr.length > 1){
            tempStr = tempStrArr[1];
            pathName = tempStrArr[0];
            pathName += tempStr.substring(0, 1).toUpperCase();
            pathName += tempStr.substring(1).toLowerCase();
        }

        session.setAttribute("pathName", "root");

        if (user != null) {
            result = "bodyContents";
        } else {
            result = "/login/login";
        }

        return result;
    } // End of /gw/**/*

    @RequestMapping("/accounting/**")
    public String accounting(HttpServletRequest request) {
        HttpSession session = null;
        String result = null, uri = null, pathName = null, tempStr = null;
        String[] tempStrArr = null;

        session = request.getSession();
        User user = (User) session.getAttribute("user");
        uri = request.getRequestURI();

        if (uri.substring(0, 1).equals("/"))
            uri = uri.substring(1);
        if (uri.substring(uri.length() - 1).equals("/"))
            uri = uri.substring(0, uri.length() - 1);

        tempStrArr = uri.split("/");
        if(tempStrArr.length == 0){
            pathName = "root";
        }else if(tempStrArr.length == 1){
            pathName = tempStrArr[0];
        }else if(tempStrArr.length > 1){
            tempStr = tempStrArr[1];
            pathName = tempStrArr[0];
            pathName += tempStr.substring(0, 1).toUpperCase();
            pathName += tempStr.substring(1).toLowerCase();
        }

        session.setAttribute("pathName", "root");

        if (user != null) {
            result = "bodyContents";
        } else {
            result = "/login/login";
        }

        return result;
    } // End of /accounting/**/*

    @RequestMapping("/mis/**")
    public String mis(HttpServletRequest request) {
        HttpSession session = null;
        String result = null, uri = null, pathName = null, tempStr = null;
        String[] tempStrArr = null;

        session = request.getSession();
        User user = (User) session.getAttribute("user");
        uri = request.getRequestURI();

        if (uri.substring(0, 1).equals("/"))
            uri = uri.substring(1);
        if (uri.substring(uri.length() - 1).equals("/"))
            uri = uri.substring(0, uri.length() - 1);

        tempStrArr = uri.split("/");
        if(tempStrArr.length == 0){
            pathName = "root";
        }else if(tempStrArr.length == 1){
            pathName = tempStrArr[0];
        }else if(tempStrArr.length > 1){
            tempStr = tempStrArr[1];
            pathName = tempStrArr[0];
            pathName += tempStr.substring(0, 1).toUpperCase();
            pathName += tempStr.substring(1).toLowerCase();
        }

        session.setAttribute("pathName", "root");

        if (user != null) {
            result = "bodyContents";
        } else {
            result = "/login/login";
        }

        return result;
    } // End of /mis/**/*

    @RequestMapping("/schedule")
    public String schedule(HttpServletRequest request) {
        HttpSession session = null;
        String result = null, uri = null, pathName = null, tempStr = null;
        String[] tempStrArr = null;

        session = request.getSession();
        User user = (User) session.getAttribute("user");
        uri = request.getRequestURI();

        if (uri.substring(0, 1).equals("/"))
            uri = uri.substring(1);
        if (uri.substring(uri.length() - 1).equals("/"))
            uri = uri.substring(0, uri.length() - 1);

        tempStrArr = uri.split("/");
        if(tempStrArr.length == 0){
            pathName = "root";
        }else if(tempStrArr.length == 1){
            pathName = tempStrArr[0];
        }else if(tempStrArr.length > 1){
            tempStr = tempStrArr[1];
            pathName = tempStrArr[0];
            pathName += tempStr.substring(0, 1).toUpperCase();
            pathName += tempStr.substring(1).toLowerCase();
        }

        session.setAttribute("pathName",  pathName);

        result = "/schedule/schedule";

        return result;
    } // End of /mis/**/*

    @RequestMapping("/notice")
    public String notice(HttpServletRequest request) {
        HttpSession session = null;
        String result = null, uri = null, pathName = null, tempStr = null;
        String[] tempStrArr = null;

        session = request.getSession();
        User user = (User) session.getAttribute("user");
        uri = request.getRequestURI();

        if (uri.substring(0, 1).equals("/"))
            uri = uri.substring(1);
        if (uri.substring(uri.length() - 1).equals("/"))
            uri = uri.substring(0, uri.length() - 1);

        tempStrArr = uri.split("/");
        if(tempStrArr.length == 0){
            pathName = "root";
        }else if(tempStrArr.length == 1){
            pathName = tempStrArr[0];
        }else if(tempStrArr.length > 1){
            tempStr = tempStrArr[1];
            pathName = tempStrArr[0];
            pathName += tempStr.substring(0, 1).toUpperCase();
            pathName += tempStr.substring(1).toLowerCase();
        }

        session.setAttribute("pathName",  pathName);

        result = "/notice/notice";

        return result;
    } // End of /mis/**/*
    
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
