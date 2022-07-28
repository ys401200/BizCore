package kr.co.bizcore.v1.ctrl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/a[i/procure")
public class ApiProcureCtrl extends Ctrl{

    @RequestMapping(value = "", method = RequestMethod.GET)
    public String apiProcureGet(HttpServletRequest request){
        String result = null, aesKey = null, aesIv = null, compId = null;
        HttpSession session = null;
        String list = null;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        compId = (String) session.getAttribute("compId");
        if (compId == null)
            compId = (String) request.getAttribute("compId");

        if (compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is not verified.\"}";
        } else
            list = procureService.getProcureList(compId);
            if (list == null) {
                result = "{\"result\":\"failure\",\"msg\":\"list is empty\"}";
            } else {
                list = salesService.encAes(list, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + list + "\"}";
            }
        return result;
    } // End of apiProcure

    @RequestMapping(value = "/*", method = RequestMethod.GET)
    public String apiProcureNumberGet(HttpServletRequest request){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String uri = null;
        String numberStr = null;
        String data = null;
        String[] t = null;
        int number = -1;
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
            data = procureService.getProcure(number, compId);
            if(data == null){
                result = "{\"result\":\"failure\",\"msg\":\"Sales not exist.\"}";
            }else{
                data = soppService.encAes(data, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
            }
        }

        return result;
    } // End of apiProcure
    
}
