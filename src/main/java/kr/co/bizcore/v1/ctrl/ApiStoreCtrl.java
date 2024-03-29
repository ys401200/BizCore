package kr.co.bizcore.v1.ctrl;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

import kr.co.bizcore.v1.domain.Store;
import kr.co.bizcore.v1.msg.Msg;
import kr.co.bizcore.v1.svc.StoreService;

@RequestMapping("/api/store")
@RestController
public class ApiStoreCtrl extends Ctrl {
    private static final Logger logger = LoggerFactory.getLogger(ApiStoreCtrl.class);

    @Autowired
    private StoreService storeService;

    // @GetMapping("")
    // public String storeList(HttpServletRequest request) {
    //     String result = null, data = null, aesKey = null, aesIv = null, userNo = null, compId = null;
    //     int compNo = 0;
    //     HttpSession session = null;
    //     Msg msg = null;
    //     List<Store> list = null;
    //     int i = 0;
        
    //     session = request.getSession();
    //     aesKey = (String) session.getAttribute("aesKey");
    //     aesIv = (String) session.getAttribute("aesIv");
    //     compNo = (int) session.getAttribute("compNo");
    //     userNo = (String) session.getAttribute("userNo");
    //     msg = getMsg((String) session.getAttribute("lang"));
    //     if (compNo == 0)
    //     compNo = (int) request.getAttribute("compNo");
            
    //     if (compNo == 0) {
    //         result = "{\"result\":\"failure\",\"msg\":\"" + msg.compNoNotVerified + "\"}";
    //     }else if(aesKey == null || aesIv == null){
    //         result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
    //     }else{
    //         Store store = new Store();
    //         store.setCompNo(compNo);
    //         list = storeService.getStoreList(store);
            
    //         if (list != null) {
    //             data = new Gson().toJson(list).toString();
    //         } else {
    //             data = "[]";
    //         }
            
    //         data = storeService.encAes(data, aesKey, aesIv);
    //         result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";            
    //     }

    //     return result;
    // }

    @GetMapping("/categoryStore/{categories}")
    public String getCategoryStoreList(HttpServletRequest request, @PathVariable String categories) throws UnsupportedEncodingException {
        String result = null, data = null, aesKey = null, aesIv = null, userNo = null, compId = null;
        int compNo = 0;
        HttpSession session = null;
        Msg msg = null;
        List<Store> list = null;
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
            Store store = new Store();
            store.setCompNo(compNo);
            store.setCategories(categories);
            list = storeService.getCategoryStoreList(store);
            
            if (list != null) {
                data = new Gson().toJson(list).toString();
            } else {
                data = "[]";
            }
            
            data = storeService.encAes(data, aesKey, aesIv);
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
        Store store = null;
        String data = null;
        String aesKey, aesIv = null;

        if (no == null) { // 글 번호 확인 안됨
            result = "{\"result\":\"failure\",\"msg\":\"storeNo is not exist\"}";
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
                store = storeService.getStore(compNo, no); // 삭제(update) 카운트를 실제 삭제 여부를 확인함

                if (store != null) { // 처리됨
                    data = store.toJson();
                    data = storeService.encAes(data, aesKey, aesIv);
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
        data = storeService.decAes(requestBody, aesKey, aesIv);
        Store store = mapper.readValue(data, Store.class);
        store.setCompNo(compNo);

        check = storeService.insertStore(store);

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
                num = storeService.delete(compNo, no); // 삭제(update) 카운트를 실제 삭제 여부를 확인함
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
        data = storeService.decAes(requestBody, aesKey, aesIv);
        Store store = mapper.readValue(data, Store.class);
        store.setCompNo(compNo);
        logger.info(store.toString());

        if (storeService.updateStore(store) > 0) {
            result = "{\"result\":\"ok\"}";
        }

        return result;
    }

}
