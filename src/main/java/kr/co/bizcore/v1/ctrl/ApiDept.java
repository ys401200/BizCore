package kr.co.bizcore.v1.ctrl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/dept")
@Slf4j
public class ApiDept extends Ctrl{

    private static final Logger logger = LoggerFactory.getLogger(AccountingController.class);

    @RequestMapping(value = "/map", method = RequestMethod.GET)
    public String deptMap(HttpServletRequest request) {
        String result = null, userNo = null, aesKey = null, aesIv = null, map = null, compId = null;
        
        HttpSession session = request.getSession();

        userNo = (String)session.getAttribute("userNo");
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else if(userNo == null){
            result = "{\"result\":\"failure\",\"msg\":\"Session Expired and/or Not logged in.\"}";            
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
        }else{
            map = deptService.getDeptJson(compId);
            map = deptService.encAes(map, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + map + "\"}";
        }

        return result;
    }
    
}
