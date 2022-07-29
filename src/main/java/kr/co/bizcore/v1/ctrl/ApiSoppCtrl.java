package kr.co.bizcore.v1.ctrl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import kr.co.bizcore.v1.domain.Sopp;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/sopp")
@Slf4j
public class ApiSoppCtrl extends Ctrl{

    private static final Logger logger = LoggerFactory.getLogger(ApiSoppCtrl.class);

    @RequestMapping(value = "", method = RequestMethod.GET)
    public String apiSopp(HttpServletRequest request){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        HttpSession session = null;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
        }else{
            result = soppService.getSoppList(compId);
            result = soppService.encAes(result, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
        }

        return result;
    } // End of apiSopp
    @RequestMapping(value = "/*", method = RequestMethod.GET)
    public String apiSoppNumber(HttpServletRequest request){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String uri = null;
        String numberStr = null;
        String[] t = null;
        int number = -1;
        Sopp sopp = null;
        HttpSession session = null;

        uri = request.getRequestURI();
        if (uri.substring(0, 1).equals("/"))
            uri = uri.substring(1);
        if (uri.substring(uri.length() - 1).equals("/"))
            uri = uri.substring(0, uri.length() - 1);
        t = uri.split("/");

        if(t.length >= 3){
            numberStr = t[2];
            number = numberStr != null ? systemService.strToInt(numberStr) : -1;
        }

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else if(number < 0){
            result = "{\"result\":\"failure\",\"msg\":\"Sopp number is invalid.\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
        }else{
            sopp = soppService.getSopp(number, compId);
            if(sopp == null){
                result = "{\"result\":\"failure\",\"msg\":\"Sopp not exist.\"}";
            }else{
                result = sopp.toJson();
                result = soppService.encAes(result, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
            }
        }

        return result;
    } // End of apiSoppNumber()
}
