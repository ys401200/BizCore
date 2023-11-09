package kr.co.bizcore.v1.ctrl;

import java.nio.file.Path;
import java.util.List;

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
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.bizcore.v1.domain.Cust;
import kr.co.bizcore.v1.domain.Product;
import kr.co.bizcore.v1.domain.Sopp;
import kr.co.bizcore.v1.msg.Msg;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/product")
@Slf4j
public class ApiProductCtrl extends Ctrl{

    private static final Logger logger = LoggerFactory.getLogger(ApiProductCtrl.class);

    @GetMapping("")
    public String productList(HttpServletRequest request) {
        String result = null, data = null, aesKey = null, aesIv = null, userNo = null, compId = null;
        int compNo = 0;
        HttpSession session = null;
        Msg msg = null;
        List<Product> list = null;
        int i = 0;
        
        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        compNo = (int) session.getAttribute("compNo");
        userNo = (String) session.getAttribute("userNo");
        msg = getMsg((String) session.getAttribute("lang"));
        if (compNo == 0)
        compNo = (int) request.getAttribute("compNo");
            
        if (compNo == 0) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compNoNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            Product product = new Product();
            product.setCompNo(compNo);
            list = productService.getProductList(product);
            if (list != null) {
                data = "[";
                for (i = 0; i < list.size(); i++) {
                    if (i > 0)
                    data += ",";
                    data += list.get(i).toJson();
                }
                data += "]";
            } else {
                data = "[]";
            }
            data = productService.encAes(data, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";            
        }

        return result;
    }

    @RequestMapping(value = "/{no}", method = RequestMethod.GET)
    public String getDetail(HttpServletRequest req, @PathVariable String no) {
        HttpSession session = null;
        String compId = null;
        int compNo = 0;
        String result = null;
        String userNo = null;
        Product product = null;
        String data = null;
        String aesKey, aesIv = null;

        if (no == null) { // 글 번호 확인 안됨
            result = "{\"result\":\"failure\",\"msg\":\"salesNo is not exist\"}";
        } else { // 글 번호 확인 됨
            session = req.getSession();
            compId = (String) session.getAttribute("compId");
            compNo = (int) session.getAttribute("compNo");
            aesKey = (String) session.getAttribute("aesKey");
            aesIv = (String) session.getAttribute("aesIv");
            if (compId == null)
                compId = (String) req.getAttribute("compId");
            userNo = (String) session.getAttribute("userNo");

            if (compId == null) { // 회사코드 확인 안됨
                result = "{\"result\":\"failure\",\"msg\":\"Company ID is not verified.\"}";
            } else if (userNo == null) {
                result = "{\"result\":\"failure\",\"msg\":\"Session expired and/or Not logged in.\"}";
            } else { // 회사코드 확인 됨
                product = productService.getProduct(compNo, no);

                if (product != null) { // 처리됨
                    data = product.toJson();
                    data = custService.encAes(data, aesKey, aesIv);
                    result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
                    
                } else { // 처리 안됨
                    result = "{\"result\":\"failure\",\"msg\":\"Error occured when read.\"}";
                } // End of if : 3
            } // End of if : 2
        } // End of if : 1
        return result;
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public String insert(HttpServletRequest req, @RequestBody String requestBody) throws JsonMappingException, JsonProcessingException {

        int compNo = 0;
        HttpSession session = null;
        String result = null;
        String data = null, aesKey = null, aesIv = null;
        ObjectMapper mapper = new ObjectMapper();
        int check = 0;

        session = req.getSession();

        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        compNo = (int) session.getAttribute("compNo");
        data = productService.decAes(requestBody, aesKey, aesIv);
        Product product = mapper.readValue(data, Product.class);
        product.setCompNo(compNo);
        
        check = productService.insertProduct(product);

        if (check > 0) {
            result = "{\"result\":\"ok\"}";
        } else {
            result = "{\"result\":\"failure\" ,\"msg\":\"Error occured when write.\"}";
        }

        return result;
    }

    @RequestMapping(value = "/{no}", method = RequestMethod.DELETE)
    public String delete(HttpServletRequest req, @PathVariable String no) {
        HttpSession session = null;
        String compId = null;
        int compNo = 0;
        String result = null;
        String userNo = null;
        String uri = req.getRequestURI();
        String[] t = null;
        int num = 0;

        // 글 번호 확인
        if (no == null) { // 글 번호 확인 안됨
            result = "{\"result\":\" failure\",\"msg\":\"notiNo is not exist\"}";
        } else { // 글 번호 확인 됨
            session = req.getSession();

            userNo = (String) session.getAttribute("userNo");
            compNo = (int) session.getAttribute("compNo");
            compId = (String) session.getAttribute("compId");
            if (compId == null)
                compId = (String) req.getAttribute("compId");

            if (compId == null) { // 회사코드 확인 안됨
                result = "{\"result\":\" failure\",\"msg\":\"Company ID is not verified.\"}";
            } else if (userNo == null) {
                result = "{\"result\":\"failure\",\"msg\":\"Session expired and/or Not logged in.\"}";
            } else { // 회사코드 확인 됨
                num = productService.delete(compNo, no); // 삭제(update) 카운트를 실제 삭제 여부를 확인함
                if (num > 0) { // 처리됨
                    result = "{\"result\":\"ok\"}";
                } else { // 처리 안됨
                    result = "{\"result\":\" failure\",\"msg\":\"Error occured when delete.\"}";
                } // End of if : 3
            } // End of if : 2
        } // End of if : 1
        return result;
    }
    
    @RequestMapping(value = "/{no}", method = RequestMethod.PUT)
    public String update(HttpServletRequest req, @RequestBody String requestBody, @PathVariable String no) throws JsonMappingException, JsonProcessingException {
        String compId = null;
        int compNo = 0;
        String result = null;
        HttpSession session = null;
        String data = null, aesKey = null, aesIv = null;
        ObjectMapper mapper = new ObjectMapper();

        session = req.getSession();
        compNo = (int) session.getAttribute("compNo");
        compId = (String) session.getAttribute("compId");
        if (compId == null) {
            compId = (String) req.getAttribute("compId");
        }

        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        data = productService.decAes(requestBody, aesKey, aesIv);
        Product product = mapper.readValue(data, Product.class);
        product.setCompNo(compNo);

        if (productService.updateProduct(product) > 0) {
            result = "{\"result\":\"ok\"}";
        }

        return result;
    }

    // @GetMapping("")
    // public String apiProductGet(HttpServletRequest request){
    //     String result = null, aesKey = null, aesIv = null, compId = null;
    //     HttpSession session = null;
    //     String list = null;

    //     session = request.getSession();
    //     aesKey = (String) session.getAttribute("aesKey");
    //     aesIv = (String) session.getAttribute("aesIv");
    //     compId = (String) session.getAttribute("compId");
    //     if (compId == null)
    //         compId = (String) request.getAttribute("compId");

    //     if (compId == null) {
    //         result = "{\"result\":\"failure\",\"msg\":\"Company ID is not verified.\"}";
    //     }else if(aesKey == null || aesIv == null){
    //         result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
    //     }else
    //         list = systemService.getProductList(compId);
    //         if (list == null) {
    //             result = "{\"result\":\"failure\",\"msg\":\"list is empty\"}";
    //         } else {
    //             list = contractService.encAes(list, aesKey, aesIv);
    //             result = "{\"result\":\"ok\",\"data\":\"" + list + "\"}";
    //         }
    //     return result;
    // } // End of apiProductGet()

    // @GetMapping("/{start:\\d+}/{end:\\d+}")
    // public String apiProductGet(HttpServletRequest request, @PathVariable("start") int start, @PathVariable("end") int end){
    //     String result = null, aesKey = null, aesIv = null, compId = null;
    //     HttpSession session = null;
    //     String list = null;
    //     int count = -9999;

    //     session = request.getSession();
    //     aesKey = (String) session.getAttribute("aesKey");
    //     aesIv = (String) session.getAttribute("aesIv");
    //     compId = (String) session.getAttribute("compId");
    //     if (compId == null)
    //         compId = (String) request.getAttribute("compId");

    //     if (compId == null) {
    //         result = "{\"result\":\"failure\",\"msg\":\"Company ID is not verified.\"}";
    //     }else if(aesKey == null || aesIv == null){
    //         result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
    //     }else
    //         list = systemService.getProductList(compId, start, end);
    //         count = systemService.getProductCount(compId);
    //         if (list == null) {
    //             result = "{\"result\":\"failure\",\"msg\":\"list is empty\"}";
    //         } else {
    //             list = encAes(list, aesKey, aesIv);
    //             result = "{\"result\":\"ok\",\"data\":\"" + list + "\",\"count\":" + count + ",\"start\":" + start + ",\"end\":" + end + "}";
    //         }
    //     return result;
    // } // End of apiProductGet()

    // @GetMapping("/{no:\\d+}")
    // public String apiProductNumberGet(HttpServletRequest request, @PathVariable("no") int no){
    //     String result = null, aesKey = null, aesIv = null, compId = null;
    //     Product prod = null;
    //     HttpSession session = null;

    //     session = request.getSession();
    //     aesKey = (String) session.getAttribute("aesKey");
    //     aesIv = (String) session.getAttribute("aesIv");
    //     compId = (String) session.getAttribute("compId");
    //     if (compId == null)
    //         compId = (String) request.getAttribute("compId");

    //     if (compId == null) {
    //         result = "{\"result\":\"failure\",\"msg\":\"Company ID is not verified.\"}";
    //     }else if(aesKey == null || aesIv == null){
    //         result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
    //     }else
    //         prod = systemService.getProduct(compId, no);
    //         if (prod == null) {
    //             result = "{\"result\":\"failure\",\"msg\":\"list is empty\"}";
    //         } else {
    //             result = contractService.encAes(prod.toJson(), aesKey, aesIv);
    //             result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
    //         }
    //     return result;
    // } // End of apiProductNumberGet()

    // @PostMapping("")
    // public String apiProductPost(HttpServletRequest request, @RequestBody String requestBody){
    //     String result = null, aesKey = null, aesIv = null, compId = null, data = null;
    //     Product prod = null;
    //     HttpSession session = null;
    //     ObjectMapper mapper = null;
    //     boolean e = false;

    //     mapper = new ObjectMapper();
    //     session = request.getSession();
    //     aesKey = (String) session.getAttribute("aesKey");
    //     aesIv = (String) session.getAttribute("aesIv");
    //     compId = (String) session.getAttribute("compId");
    //     if (compId == null)
    //         compId = (String) request.getAttribute("compId");

    //     if (compId == null) {
    //         result = "{\"result\":\"failure\",\"msg\":\"Company ID is not verified.\"}";
    //     }else if(aesKey == null || aesIv == null){
    //         result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
    //     }else
    //         try {
    //             data = decAes(requestBody, aesKey, aesIv);
    //             prod = mapper.readValue(data, Product.class);
    //             e = 0 < systemService.addProduct(compId, prod);
    //             if(e)   result = "{\"result\":\"ok\"}";
    //             else    result = "{\"result\":\"failure\",\"msg\":\"Ann error occurred.\"}";
    //         }catch (Exception ex) {
    //             ex.printStackTrace();
    //             result = "{\"result\":\"failure\",\"msg\":\"Ann error occurred.\"}";
    //         }
    //     return result;
    // } // End of apiProductPost()

    // @PutMapping("/{no:\\d+}")
    // public String apiProductPut(HttpServletRequest request, @PathVariable("no") int no, @RequestBody String requestBody){
    //     String result = null, aesKey = null, aesIv = null, compId = null, data = null;
    //     Product prod = null;
    //     HttpSession session = null;
    //     ObjectMapper mapper = null;
    //     boolean e = false;

    //     mapper = new ObjectMapper();
    //     session = request.getSession();
    //     aesKey = (String) session.getAttribute("aesKey");
    //     aesIv = (String) session.getAttribute("aesIv");
    //     compId = (String) session.getAttribute("compId");
    //     if (compId == null)
    //         compId = (String) request.getAttribute("compId");

    //     if (compId == null) {
    //         result = "{\"result\":\"failure\",\"msg\":\"Company ID is not verified.\"}";
    //     }else if(aesKey == null || aesIv == null){
    //         result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
    //     }else{
    //         data = decAes(requestBody, aesKey, aesIv);
    //         if(data == null){
    //             result = "{\"result\":\"failure\",\"msg\":\"Decryption fail.\"}";
    //         }else{
    //             try {
    //                 prod = mapper.readValue(data, Product.class);
    //                 e = 0 < systemService.modifyProduct(compId, no, prod);
    //                 if(e)   result = "{\"result\":\"ok\"}";
    //                 else    result = "{\"result\":\"failure\",\"msg\":\"Ann error occurred.\"}";
    //             }catch (Exception ex) {
    //                 ex.printStackTrace();
    //                 result = "{\"result\":\"failure\",\"msg\":\"Ann error occurred.\"}";
    //             }
    //         }
    //     }
    //     return result;
    // } // End of apiProductPut()

    // @DeleteMapping("/{no:\\d+}")
    // public String apiProductDelete(HttpServletRequest request, @PathVariable("no") int no){
    //     String result = null, compId = null;
    //     HttpSession session = null;
    //     int e = 0;

    //     session = request.getSession();
    //     compId = (String) session.getAttribute("compId");
    //     if (compId == null)
    //         compId = (String) request.getAttribute("compId");

    //     if (compId == null) {
    //         result = "{\"result\":\"failure\",\"msg\":\"Company ID is not verified.\"}";
    //     }else{
    //         e = systemService.removeProduct(compId, no);
    //         if(e > 0)   result = "{\"result\":\"ok\"}";
    //         else    result = "{\"result\":\"failure\",\"msg\":\"Ann error occurred.\"}";
    //     }
    //     return result;
    // } // End of apiProductDelete()


    
}
