package kr.co.bizcore.v1.ctrl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.databind.ObjectMapper;
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

    @RequestMapping(value = "/{no:\\d+}", method = RequestMethod.GET)
    public String apiSoppNumber(HttpServletRequest request, @PathVariable int no){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String sopp = null;
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
            sopp = soppService.getSopp(no, compId, aesKey, aesIv);
            if(sopp == null){
                result = "{\"result\":\"failure\",\"msg\":\"Sopp not exist.\"}";
            }else{
                result = soppService.encAes(sopp, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
            }
        }

        return result;
    } // End of apiSoppNumber()

    @RequestMapping(value = "/{no:\\d+}/schedule", method = RequestMethod.GET)
    public String apiSoppNumberSchedule(HttpServletRequest request, @PathVariable int soppNo){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String data = null;
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
            data = scheduleSvc.getScheduleRelatedSopp(compId, soppNo);
            if(data == null){
                result = "{\"result\":\"failure\",\"msg\":\"Sopp not exist.\"}";
            }else{
                data = soppService.encAes(data, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
            }
        }

        return result;
    } // End of apiSoppNumberSchedule()

    @RequestMapping(value = "", method = RequestMethod.POST)
    public String apiSoppPost(HttpServletRequest request, @RequestBody String requestBody) {
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String data = null;
        ObjectMapper mapper = null;
        Sopp sopp = null;
        HttpSession session = null;

        mapper = new ObjectMapper();
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
            data = procureService.decAes(requestBody, aesKey, aesIv);
            if(data == null){
                result = "{\"result\":\"failure\",\"msg\":\"Decryption fail.\"}";
            }else   try {
                sopp = mapper.readValue(data, Sopp.class);
                if(soppService.addSopp(sopp, compId))  result = "{\"result\":\"ok\"}";
                else                                   result = "{\"result\":\"failure\",\"msg\":\"An error occurred\"}";
            } catch (Exception e) {e.printStackTrace();result = "{\"result\":\"failure\",\"msg\":\"An error occurred\"}";}
        }
        return result;
    }

    @RequestMapping(value = "/{no}", method = RequestMethod.PUT)
    public String apiSoppPut(HttpServletRequest request, @RequestBody String requestBody, @PathVariable String no) {
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String data = null;
        ObjectMapper mapper = null;
        Sopp sopp = null;
        HttpSession session = null;

        mapper = new ObjectMapper();
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
            data = procureService.decAes(requestBody, aesKey, aesIv);
            if(data == null){
                result = "{\"result\":\"failure\",\"msg\":\"Decryption fail.\"}";
            }else   try {
                sopp = mapper.readValue(data, Sopp.class);
                if(soppService.modifySopp(no, sopp, compId))    result = "{\"result\":\"ok\"}";
                else                                            result = "{\"result\":\"failure\",\"msg\":\"An error occurred\"}";
            } catch (Exception e) {e.printStackTrace();result = "{\"result\":\"failure\",\"msg\":\"An error occurred\"}";}
        }
        return result;
    }

    @RequestMapping(value = "/{no}", method = RequestMethod.DELETE)
    public String apiSoppPut(HttpServletRequest request, @PathVariable String no) {
        String result = null;
        String compId = null;
        
        HttpSession session = null;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else{
            if(soppService.removeSopp(no, compId))  result = "{\"result\":\"ok\"}";
            else                                    result = "{\"result\":\"failure\",\"msg\":\"An error occurred\"}";
        }
        return result;
    }
    
}
