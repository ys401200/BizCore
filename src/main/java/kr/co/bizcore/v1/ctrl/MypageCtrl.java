package kr.co.bizcore.v1.ctrl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import kr.co.bizcore.v1.domain.SimpleUser;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/mypage")
@Slf4j
public class MypageCtrl extends Ctrl {

    private static final Logger logger = LoggerFactory.getLogger(MypageCtrl.class);
    
    @RequestMapping(value ="" , method = RequestMethod.GET)
    public String mypage(HttpServletRequest request) {
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

        result = "/mypage/list";

        return result;
    }

}
