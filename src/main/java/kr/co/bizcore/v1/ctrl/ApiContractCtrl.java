package kr.co.bizcore.v1.ctrl;

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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.bizcore.v1.domain.Contract;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/contract")
@Slf4j
public class ApiContractCtrl extends Ctrl{

    private static final Logger logger = LoggerFactory.getLogger(ApiContractCtrl.class);

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
            list = contractService.getContractList(compId);
            if (list == null) {
                result = "{\"result\":\"failure\",\"msg\":\"list is empty\"}";
            } else {
                list = contractService.encAes(list, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + list + "\"}";
            }
        return result;
    } // End of apiProcureGet

    @RequestMapping(value = "/{no}", method = RequestMethod.GET)
    public String getDetail(HttpServletRequest request, @PathVariable String no){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String data = null;
        int number = -1;
        Contract contract = null;
        HttpSession session = null;

        number = salesService.strToInt(no);

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
            contract = contractService.getContract(number, compId);
            if(contract == null){
                result = "{\"result\":\"failure\",\"msg\":\"Sales not exist.\"}";
            }else{
                data = contractService.encAes(contract.toJson(), aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
            }
        }

        return result;
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public String apiProcurePost(HttpServletRequest request, @RequestBody String requestBody){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String data = null;
        ObjectMapper mapper = null;
        JSONObject json = null;
        Contract contract = null;
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
                try {
                    mapper = new ObjectMapper();
                    contract = mapper.readValue(data, Contract.class);
                    contract.setCreated(null);
                    if(contractService.addContract(contract, compId))  result = "{\"result\":\"ok\"}";
                    else                                               result = "{\"result\":\"failure\",\"msg\":\"An error occurred\"}";
                } catch (Exception e) {
                    result = "{\"result\":\"failure\",\"msg\":\"An error occurred\"}";
                    e.printStackTrace();
                }

            }
        }

        return result;
    } // End of apiProcurePost()

    @RequestMapping(value = "/{no}", method = RequestMethod.PUT)
    public String apiProcureNumberPut(HttpServletRequest request, @RequestBody String requestBody, @PathVariable String no){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String data = null;
        JSONObject json = null;
        Contract contract = null;
        HttpSession session = null;
        ObjectMapper mapper = null;

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
                try {
                    mapper = new ObjectMapper();
                    contract = mapper.readValue(data, Contract.class);
                    if(contractService.modifyContract(no, contract, compId))  result = "{\"result\":\"ok\"}";
                    else                                               result = "{\"result\":\"failure\",\"msg\":\"An error occurred\"}";
                } catch (Exception e) {
                    result = "{\"result\":\"failure\",\"msg\":\"An error occurred\"}";
                    e.printStackTrace();
                }
            }
        }

        return result;
    } // End of apiProcureNumberPut()

    @RequestMapping(value = "/{no}", method = RequestMethod.DELETE)
    public String apiProcureNumberDelete(HttpServletRequest request, @PathVariable String no){
        String result = null;
        String compId = null;
        HttpSession session = null;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else{
            if(contractService.removeContract(no, compId))    result = "{\"result\":\"ok\"}";
            else                                            result = "{\"result\":\"failure\",\"msg\":\"An error occurred\"}";
        }

        return result;
    } // End of apiProcureNumberDelete()
    
}
