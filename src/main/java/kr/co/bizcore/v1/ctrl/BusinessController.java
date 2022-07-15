package kr.co.bizcore.v1.ctrl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import kr.co.bizcore.v1.domain.SimpleUser;

@Controller
@RequestMapping("/business")
public class BusinessController {
    @RequestMapping("/notice")
    public String notice(HttpServletRequest request) {
        HttpSession session = null;
        String result = null, uri = null, pathName = null, tempStr = null;
        String[] tempStrArr = null;

        session = request.getSession();
        SimpleUser user = (SimpleUser) session.getAttribute("user");
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

        session.setAttribute("pathName", pathName);

        result = "/notice/notice";

        return result;
    } // End of /business/**

    @RequestMapping("/schedule")
    public String schedule(HttpServletRequest request) {
        HttpSession session = null;
        String result = null, uri = null, pathName = null, tempStr = null;
        String[] tempStrArr = null;

        session = request.getSession();
        SimpleUser user = (SimpleUser) session.getAttribute("user");
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
    } // End of /business/**

    @RequestMapping("/calendar")
    public String calendar(HttpServletRequest request) {
        HttpSession session = null;
        String result = null, uri = null, pathName = null, tempStr = null;
        String[] tempStrArr = null;

        session = request.getSession();
        SimpleUser user = (SimpleUser) session.getAttribute("user");
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

        result = "/schedule/calendar";

        return result;
    } // End of /business/**
}
