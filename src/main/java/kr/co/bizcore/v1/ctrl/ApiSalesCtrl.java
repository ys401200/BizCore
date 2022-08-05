package kr.co.bizcore.v1.ctrl;

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

import kr.co.bizcore.v1.domain.Sales;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/sales")
@Slf4j
public class ApiSalesCtrl extends Ctrl{

    private static final Logger logger = LoggerFactory.getLogger(ApiSalesCtrl.class);

    @RequestMapping(value = "", method = RequestMethod.GET)
    public String apiSalesGet(HttpServletRequest request){
        String result = null, data = null, aesKey = null, aesIv = null, compId = null;
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
            list = salesService.getSalesList(compId);
            if (list == null) {
                result = "{\"result\":\"failure\",\"msg\":\"list is empty\"}";
            } else {
                list = salesService.encAes(list, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + list + "\"}";
            }
        return result;
    }

    @RequestMapping(value = "/{no}", method = RequestMethod.GET)
    public String apiSalesNumberGet(HttpServletRequest request, @PathVariable String no){
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
            data = salesService.getSales(no, compId);
            if(data == null){
                result = "{\"result\":\"failure\",\"msg\":\"Sales not exist.\"}";
            }else{
                data = salesService.encAes(data, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
            }
        }

        return result;
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public String apiSalesPost(HttpServletRequest request, @RequestBody String requestBody){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String json = null;
        ObjectMapper mapper = null;
        Sales sales = null;
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
            json = salesService.decAes(requestBody, aesKey, aesIv);
            try {
                sales = mapper.readValue(json, Sales.class);
                if(salesService.addSales(sales, compId))    result = "{\"result\":\"ok\"}";
                else                                        result = "{\"result\":\"failure\",\"msg\":\"An error occurred.\"}";
            } catch (Exception e) {
                result = "{\"result\":\"failure\",\"msg\":\"Data is wrong.\"}";
            }
        }
        return result;
    }

    @RequestMapping(value = "/{no}", method = RequestMethod.PUT)
    public String apiSalesNumberPut(HttpServletRequest request, @PathVariable String no, @RequestBody String requestBody){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String json = null;
        ObjectMapper mapper = null;
        Sales sales = null;
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
            json = salesService.decAes(requestBody, aesKey, aesIv);
            try {
                sales = mapper.readValue(json, Sales.class);
                if(salesService.modifySales(no, sales, compId)) result = "{\"result\":\"ok\"}";
                else                                            result = "{\"result\":\"failure\",\"msg\":\"An error occurred.\"}";
            } catch (Exception e) {
                result = "{\"result\":\"failure\",\"msg\":\"Data is wrong.\"}";
            }
        }
        return result;
    }

    @RequestMapping(value = "/{no}", method = RequestMethod.DELETE)
    public String apiSalesNumberPut(HttpServletRequest request, @PathVariable String no){
        String result = null;
        String compId = null;
        HttpSession session = null;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else{
            if(salesService.removeSales(no, compId))    result = "{\"result\":\"ok\"}";
            else                                        result = "{\"result\":\"failure\",\"msg\":\"An error occurred.\"}";
        }
        return result;
    }

    
}
