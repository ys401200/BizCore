package kr.co.bizcore.v1.ctrl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import kr.co.bizcore.v1.domain.SimpleUser;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/business")
@Slf4j
public class BusinessController extends Ctrl{

    private static final Logger logger = LoggerFactory.getLogger(BusinessController.class);

    @RequestMapping(value={"/notice","/notice/{no:\\d+}"})
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

        result = "/notice/list";

        return result;
    } // End of /business/**

    @RequestMapping(value={"/schedule","/schedule/{no:\\d+}"})
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

    @RequestMapping(value={"/sales","/sales/{no:\\d+}"})
    public String sales(HttpServletRequest request) {
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

        result = "/sales/list";

        return result;
    } // End of /business/**

    @RequestMapping(value={"/sopp","/sopp/{no:\\d+}"})
    public String sopp(HttpServletRequest request) {
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

        result = "/sopp/list";

        return result;
    } // End of /business/**

    @RequestMapping("/est")
    public String est(HttpServletRequest request) {
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

        result = "/est/list";

        return result;
    } // End of /business/**

    @RequestMapping(value={"/contract","/contract/{no:\\d+}"})
    public String cont(HttpServletRequest request) {
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

        result = "/contract/list";

        return result;
    } // End of /business/**

    @RequestMapping(value={"/tech","/tech/{no:\\d+}"})
    public String tech(HttpServletRequest request) {
        HttpSession session = null;
        String result = null, uri = null, pathName = null, tempStr = null;
        String[] tempStrArr = null;

        session = request.getSession();
        SimpleUser user = (SimpleUser) session.getAttribute("user");
        uri = request.getRequestURI();

        if (uri.substring(0, 1).equals("/"));
            uri = uri.substring(1);

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

        result = "/tech/list";

        return result;
    } // End of /business/**

    @RequestMapping("/filebox")
    public String filebox(HttpServletRequest request) {
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

        result = "/filebox/filebox";

        return result;
    } // End of /filebox/**

    @RequestMapping("/workreport")
    public String workreport(HttpServletRequest request) {
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

        result = "/workreport/workreport";

        return result;
    } // End of /business/**

    @RequestMapping("/workjournal")
    public String workjournal(HttpServletRequest request) {
        HttpSession session = null;
        String result = null, uri = null, pathName = null, tempStr = null;
        String[] tempStrArr = null;

        session = request.getSession();
        SimpleUser user = (SimpleUser) session.getAttribute("user");
        uri = request.getRequestURI();

        if (uri.substring(0, 1).equals("/"));
            uri = uri.substring(1);

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

        result = "/workreport/workjournal";

        return result;
    } // End of /business/**

    @RequestMapping("/goal")
    public String goal(HttpServletRequest request) {
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

        result = "/goal/list";

        return result;
    } // End of /business/**

    @RequestMapping(value={"/customer", "/customer/{no:\\d+}"})
    public String customer(HttpServletRequest request) {
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

        result = "/customer/list";

        return result;
    } // End of /business/**
}
