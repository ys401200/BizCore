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

import kr.co.bizcore.v1.domain.Procure;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/a[i/procure")
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
    } // End of apiProcureGet

    @RequestMapping(value = "", method = RequestMethod.POST)
    public String apiProcurePost(HttpServletRequest request, @RequestBody String requestBody){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String data = null;
        JSONObject json = null;
        Procure procure = null;
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
                procure = new Procure();
                json = new JSONObject(data);
                procure.setBuyerArea(json.getString("buyerArea"));
                procure.setBuyerAreaCode(json.getString("buyerAreaCode"));
                procure.setBuyerCode(json.getString("buyerCode"));
                procure.setBuyerName(json.getString("buyerName"));
                procure.setContractDate(new Date(strToLong(json.getString("contractDate"))));
                procure.setDeliveryDate(new Date(strToLong(json.getString("DeliveryDate"))));
                procure.setDeliveryPlace(json.getString("deliveryPlace"));
                procure.setItemAmount(json.getLong("itemAmount"));
                procure.setItemNetPrice(json.getInt("itemNetPrice"));
                procure.setItemQty(json.getInt("itemQty"));
                procure.setItemUnit(json.getString("itemUnit"));
                procure.setModAmount(json.getLong("modAmount"));
                procure.setModQty(json.getInt("modQty"));
                procure.setRequestItem(json.getString("requestItem"));
                procure.setRequestItemCode(json.getString("requestItemCode"));
                procure.setRequestNo(json.getString("requestNo"));
                procure.setSopp(json.getInt("sopp"));
                procure.setTitle(json.getString("title"));
                if(procureService.addProcure(procure, compId))  result = "{\"result\":\"ok\"}";
                else                                            result = "{\"result\":\"failure\",\"msg\":\"An error occurred\"}";
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
        Procure procure = null;
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
                procure = new Procure();
                json = new JSONObject(data);
                procure.setNo(strToInt(no));
                procure.setBuyerArea(json.getString("buyerArea"));
                procure.setBuyerAreaCode(json.getString("buyerAreaCode"));
                procure.setBuyerCode(json.getString("buyerCode"));
                procure.setBuyerName(json.getString("buyerName"));
                procure.setContractDate(new Date(strToLong(json.getString("contractDate"))));
                procure.setDeliveryDate(new Date(strToLong(json.getString("DeliveryDate"))));
                procure.setDeliveryPlace(json.getString("deliveryPlace"));
                procure.setItemAmount(json.getLong("itemAmount"));
                procure.setItemNetPrice(json.getInt("itemNetPrice"));
                procure.setItemQty(json.getInt("itemQty"));
                procure.setItemUnit(json.getString("itemUnit"));
                procure.setModAmount(json.getLong("modAmount"));
                procure.setModQty(json.getInt("modQty"));
                procure.setRequestItem(json.getString("requestItem"));
                procure.setRequestItemCode(json.getString("requestItemCode"));
                procure.setRequestNo(json.getString("requestNo"));
                procure.setSopp(json.getInt("sopp"));
                procure.setTitle(json.getString("title"));
                if(procureService.addProcure(procure, compId))  result = "{\"result\":\"ok\"}";
                else                                            result = "{\"result\":\"failure\",\"msg\":\"An error occurred\"}";
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
            if(procureService.removeProcure(no, compId))    result = "{\"result\":\"ok\"}";
            else                                            result = "{\"result\":\"failure\",\"msg\":\"An error occurred\"}";
        }

        return result;
    } // End of apiProcureNumberDelete()
    
}

