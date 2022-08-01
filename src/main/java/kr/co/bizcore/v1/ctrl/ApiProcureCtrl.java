package kr.co.bizcore.v1.ctrl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/procure")
@Slf4j
public class ApiProcureCtrl extends Ctrl{

    private static final Logger logger = LoggerFactory.getLogger(ApiProcureCtrl.class);

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

    @RequestMapping(value = "/{no}", method = RequestMethod.GET)
    public String apiProcureNumberGet(HttpServletRequest request, @PathVariable String no){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String data = null;
        int number = -1;
        HttpSession session = null;

        number = procureService.strToInt(no);

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
