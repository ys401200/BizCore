package kr.co.bizcore.v1.ctrl;

import java.nio.file.Path;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.bizcore.v1.domain.Product;

@RestController
@RequestMapping("/api/product")
public class ApiProductCtrl extends Ctrl{

    private static final Logger logger = LoggerFactory.getLogger(ApiProductCtrl.class);

    @GetMapping("")
    public String apiProductGet(HttpServletRequest request){
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
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
        }else
            list = systemService.getProductList(compId);
            if (list == null) {
                result = "{\"result\":\"failure\",\"msg\":\"list is empty\"}";
            } else {
                list = contractService.encAes(list, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + list + "\"}";
            }
        return result;
    } // End of apiProductGet()

    @GetMapping("/{start:\\d+}/{end:\\d+}")
    public String apiProductGet(HttpServletRequest request, @PathVariable("start") int start, @PathVariable("end") int end){
        String result = null, aesKey = null, aesIv = null, compId = null;
        HttpSession session = null;
        String list = null;
        int count = -9999;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        compId = (String) session.getAttribute("compId");
        if (compId == null)
            compId = (String) request.getAttribute("compId");

        if (compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is not verified.\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
        }else
            list = systemService.getProductList(compId, start, end);
            count = systemService.getProductCount(compId);
            if (list == null) {
                result = "{\"result\":\"failure\",\"msg\":\"list is empty\"}";
            } else {
                list = encAes(list, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + list + "\",\"count\":" + count + ",\"start\":" + start + ",\"end\":" + end + "}";
            }
        return result;
    } // End of apiProductGet()

    @GetMapping("/{no:\\d+}")
    public String apiProductNumberGet(HttpServletRequest request, @PathVariable("no") int no){
        String result = null, aesKey = null, aesIv = null, compId = null;
        Product prod = null;
        HttpSession session = null;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        compId = (String) session.getAttribute("compId");
        if (compId == null)
            compId = (String) request.getAttribute("compId");

        if (compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is not verified.\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
        }else
            prod = systemService.getProduct(compId, no);
            if (prod == null) {
                result = "{\"result\":\"failure\",\"msg\":\"list is empty\"}";
            } else {
                result = contractService.encAes(prod.toJson(), aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
            }
        return result;
    } // End of apiProductNumberGet()

    @PostMapping("")
    public String apiProductPost(HttpServletRequest request, @RequestBody String requestBody){
        String result = null, aesKey = null, aesIv = null, compId = null, data = null;
        Product prod = null;
        HttpSession session = null;
        ObjectMapper mapper = null;
        boolean e = false;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        compId = (String) session.getAttribute("compId");
        if (compId == null)
            compId = (String) request.getAttribute("compId");

        if (compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is not verified.\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
        }else
            try {
                data = decAes(requestBody, aesKey, aesIv);
                prod = mapper.readValue(data, Product.class);
                e = 0 < systemService.addProduct(compId, prod);
                if(e)   result = "{\"result\":\"ok\"}";
                else    result = "{\"result\":\"failure\",\"msg\":\"Ann error occurred.\"}";
            }catch (Exception ex) {
                ex.printStackTrace();
                result = "{\"result\":\"failure\",\"msg\":\"Ann error occurred.\"}";
            }
        return result;
    } // End of apiProductPost()

    @PutMapping("/{no:\\d+}")
    public String apiProductPut(HttpServletRequest request, @PathVariable("no") int no, @RequestBody String requestBody){
        String result = null, aesKey = null, aesIv = null, compId = null, data = null;
        Product prod = null;
        HttpSession session = null;
        ObjectMapper mapper = null;
        boolean e = false;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        compId = (String) session.getAttribute("compId");
        if (compId == null)
            compId = (String) request.getAttribute("compId");

        if (compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is not verified.\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
        }else
            try {
                data = decAes(requestBody, aesKey, aesIv);
                prod = mapper.readValue(data, Product.class);
                e = 0 < systemService.modifyProduct(compId, no, prod);
                if(e)   result = "{\"result\":\"ok\"}";
                else    result = "{\"result\":\"failure\",\"msg\":\"Ann error occurred.\"}";
            }catch (Exception ex) {
                ex.printStackTrace();
                result = "{\"result\":\"failure\",\"msg\":\"Ann error occurred.\"}";
            }
        return result;
    } // End of apiProductPut()

    @DeleteMapping("/{no:\\d+}")
    public String apiProductDelete(HttpServletRequest request, @PathVariable("no") int no){
        String result = null, compId = null;
        HttpSession session = null;
        ObjectMapper mapper = null;
        boolean e = false;

        session = request.getSession();
        compId = (String) session.getAttribute("compId");
        if (compId == null)
            compId = (String) request.getAttribute("compId");

        if (compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is not verified.\"}";
        }else
            e = systemService.removeProduct(compId, no);
            if(e)   result = "{\"result\":\"ok\"}";
            else    result = "{\"result\":\"failure\",\"msg\":\"Ann error occurred.\"}";
        return result;
    } // End of apiProductDelete()


    
}
