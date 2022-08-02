package kr.co.bizcore.v1.ctrl;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import kr.co.bizcore.v1.domain.Sopp;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestParam;


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

    @RequestMapping(value = "/{no}", method = RequestMethod.GET)
    public String apiSoppNumber(HttpServletRequest request, @PathVariable String no){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        Sopp sopp = null;
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
            sopp = soppService.getSopp(no, compId);
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

    @RequestMapping(value = "", method = RequestMethod.POST)
    public String apiSoppPost(HttpServletRequest request, @RequestBody String requestBody) {
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String data = null;
        JSONObject json = null;
        Sopp sopp = null;
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
            data = procureService.decAes(requestBody, aesKey, aesIv);
            if(data == null){
                result = "{\"result\":\"failure\",\"msg\":\"Decryption fail.\"}";
            }else{
                json = new JSONObject(data);
                sopp = new Sopp();
                sopp.setBusinessType(json.getString("businessType"));
                sopp.setContType(json.getInt("contType"));
                sopp.setContract(json.getInt("contract"));
                sopp.setCustomer(json.getInt("contract"));
                sopp.setDetail(json.getString("detail"));
                sopp.setEmployee(json.getInt("employee"));
                sopp.setEndOfMaintenance(new Date(json.getLong("endOfMaintenance")));
                sopp.setEndUser(json.getInt("endUser"));
                sopp.setExpectedSales(json.getLong("expectedSales"));
                sopp.setPicOfBuyer(json.getInt("picOfBuyer"));
                sopp.setPicOfCustomer(json.getString("picOfCustomer"));
                sopp.setPriority(json.getString("priority"));
                sopp.setProgress(json.getInt("progress"));
                sopp.setPtnc(json.getInt("ptnc"));
                sopp.setRemark(json.getString("remark"));
                sopp.setSoppType(json.getInt("soppType"));
                sopp.setSource(json.getInt("source"));
                sopp.setStartOfMaintenance(new Date(json.getLong("startOfMaintenance")));
                sopp.setStatus(json.getString("status"));
                sopp.setTargetDate(new Date(json.getLong("targetDate")));
                sopp.setTitle(json.getString("title"));

                if(soppService.addSopp(sopp, compId))  result = "{\"result\":\"ok\"}";
                else                                   result = "{\"result\":\"failure\",\"msg\":\"An error occurred\"}";
            }
        }



        return result;
    }
    
}
