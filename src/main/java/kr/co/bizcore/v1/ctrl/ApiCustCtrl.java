package kr.co.bizcore.v1.ctrl;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.bizcore.v1.domain.Cust;
import kr.co.bizcore.v1.domain.CustData01;
import kr.co.bizcore.v1.domain.CustData02;
import kr.co.bizcore.v1.domain.CustData03;
import kr.co.bizcore.v1.domain.Sales;
import kr.co.bizcore.v1.domain.Sopp;
import kr.co.bizcore.v1.domain.Tech;
import kr.co.bizcore.v1.msg.Msg;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/cust")
@Slf4j
public class ApiCustCtrl extends Ctrl{
    private static final Logger logger = LoggerFactory.getLogger(ApiCustCtrl.class);

    @GetMapping("")
    public String custList(HttpServletRequest request) {
        String result = null, data = null, aesKey = null, aesIv = null, userNo = null, compId = null;
        int compNo = 0;
        HttpSession session = null;
        Msg msg = null;
        List<Cust> list = null;
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
            Cust cust = new Cust();
            cust.setCompNo(compNo);
            list = custService.getCustList(cust);
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
            data = custService.encAes(data, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";            
        }

        return result;
    }

    @GetMapping("/custAllList")
    public String custAllList(HttpServletRequest request) {
        String result = null, data = null, aesKey = null, aesIv = null, userNo = null, compId = null;
        int compNo = 0;
        HttpSession session = null;
        Msg msg = null;
        List<Cust> list = null;
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
            Cust cust = new Cust();
            cust.setCompNo(compNo);
            list = custService.custAllList(cust);
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
            data = custService.encAes(data, aesKey, aesIv);
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
        Cust cust = null;
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
                cust = custService.getCust(compNo, no);

                if (cust != null) { // 처리됨
                    data = cust.toJson();
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
        data = custService.decAes(requestBody, aesKey, aesIv);
        Cust cust = mapper.readValue(data, Cust.class);
        cust.setCompNo(compNo);
        
        check = custService.insertCust(cust);

        if (check > 0) {
            result = "{\"result\":\"ok\"}";
        } else {
            result = "{\"result\":\"failure\" ,\"msg\":\"Error occured when write.\"}";
        }

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
        data = soppService.decAes(requestBody, aesKey, aesIv);
        Cust cust = mapper.readValue(data, Cust.class);
        cust.setCompNo(compNo);

        if (custService.updateCust(cust) > 0) {
            result = "{\"result\":\"ok\"}";
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
                num = custService.delete(compNo, no); // 삭제(update) 카운트를 실제 삭제 여부를 확인함
                custService.deleteCustData01(compNo, no);
                custService.deleteCustData02(compNo, no);
                custService.deleteCustData03(compNo, no);
                if (num > 0) { // 처리됨
                    result = "{\"result\":\"ok\"}";
                } else { // 처리 안됨
                    result = "{\"result\":\" failure\",\"msg\":\"Error occured when delete.\"}";
                } // End of if : 3
            } // End of if : 2
        } // End of if : 1
        return result;
    }

    @RequestMapping(value = "/customerAddChange/{no}", method = RequestMethod.PUT)
    public String customerAddChange(HttpServletRequest req, @PathVariable String no) {
        String compId = null;
        int compNo = 0;
        String result = null;
        HttpSession session = null;

        session = req.getSession();
        compNo = (int) session.getAttribute("compNo");
        compId = (String) session.getAttribute("compId");
        if (compId == null) {
            compId = (String) req.getAttribute("compId");
        }

        Cust cust = new Cust();
        cust.setCustNo(Integer.parseInt(no));
        cust.setCompNo(compNo);

        if (custService.customerAddChange(cust) > 0) {
            result = "{\"result\":\"ok\"}";
        }

        return result;
    }

    @RequestMapping(value = "/custdata01/{no}", method = RequestMethod.GET)
    public String getCustDataList01(HttpServletRequest req, @PathVariable String no) {
        HttpSession session = null;
        String compId = null;
        int compNo = 0;
        String result = null;
        String userNo = null;
        CustData01 custdata01 = null;
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
                custdata01 = custService.getCustDataList01(compNo, no);

                if (custdata01 != null) { // 처리됨
                    data = custdata01.toJson();
                    data = custService.encAes(data, aesKey, aesIv);
                    result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
                    
                } else { // 처리 안됨
                    result = "{\"result\":\"failure\",\"msg\":\"Error occured when read.\"}";
                } // End of if : 3
            } // End of if : 2
        } // End of if : 1
        return result;
    }

    @RequestMapping(value = "/insertCustData01", method = RequestMethod.POST)
    public String insertCustData01(HttpServletRequest req, @RequestBody String requestBody) throws JsonMappingException, JsonProcessingException {

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
        data = custService.decAes(requestBody, aesKey, aesIv);
        CustData01 custData01 = mapper.readValue(data, CustData01.class);
        custData01.setCompNo(compNo);
        
        check = custService.insertCustData01(custData01);

        if (check > 0) {
            result = "{\"result\":\"ok\"}";
        } else {
            result = "{\"result\":\"failure\" ,\"msg\":\"Error occured when write.\"}";
        }

        return result;
    }

    @RequestMapping(value = "/updateCustData01/{no}", method = RequestMethod.PUT)
    public String updateCustData01(HttpServletRequest req, @RequestBody String requestBody, @PathVariable String no) throws JsonMappingException, JsonProcessingException {
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
        data = soppService.decAes(requestBody, aesKey, aesIv);
        CustData01 custData01 = mapper.readValue(data, CustData01.class);
        custData01.setCompNo(compNo);

        if (custService.updateCustData01(custData01) > 0) {
            result = "{\"result\":\"ok\"}";
        }

        return result;
    }

    @RequestMapping(value = "/custdata02/{no}", method = RequestMethod.GET)
    public String getCustDataList02(HttpServletRequest req, @PathVariable String no) {
        HttpSession session = null;
        String compId = null;
        int compNo = 0;
        String result = null;
        String userNo = null;
        CustData02 custData02 = null;
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
                custData02 = custService.getCustDataList02(compNo, no);

                if (custData02 != null) { // 처리됨
                    data = custData02.toJson();
                    data = custService.encAes(data, aesKey, aesIv);
                    result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
                    
                } else { // 처리 안됨
                    result = "{\"result\":\"failure\",\"msg\":\"Error occured when read.\"}";
                } // End of if : 3
            } // End of if : 2
        } // End of if : 1
        return result;
    }

    @RequestMapping(value = "/insertCustData02", method = RequestMethod.POST)
    public String insertCustData02(HttpServletRequest req, @RequestBody String requestBody) throws JsonMappingException, JsonProcessingException {

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
        data = custService.decAes(requestBody, aesKey, aesIv);
        CustData02 custData02 = mapper.readValue(data, CustData02.class);
        custData02.setCompNo(compNo);
        
        check = custService.insertCustData02(custData02);

        if (check > 0) {
            result = "{\"result\":\"ok\"}";
        } else {
            result = "{\"result\":\"failure\" ,\"msg\":\"Error occured when write.\"}";
        }

        return result;
    }

    @RequestMapping(value = "/updateCustData02/{no}", method = RequestMethod.PUT)
    public String updateCustData02(HttpServletRequest req, @RequestBody String requestBody, @PathVariable String no) throws JsonMappingException, JsonProcessingException {
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
        data = soppService.decAes(requestBody, aesKey, aesIv);
        CustData02 custData02 = mapper.readValue(data, CustData02.class);
        custData02.setCompNo(compNo);

        if (custService.updateCustData02(custData02) > 0) {
            result = "{\"result\":\"ok\"}";
        }

        return result;
    }

    @RequestMapping(value = "/custdata03/{no}", method = RequestMethod.GET)
    public String getCustDataList03(HttpServletRequest req, @PathVariable String no) {
        HttpSession session = null;
        String compId = null;
        int compNo = 0;
        String result = null;
        String userNo = null;
        CustData03 custdata03 = null;
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
                custdata03 = custService.getCustDataList03(no);

                if (custdata03 != null) { // 처리됨
                    data = custdata03.toJson();
                    data = custService.encAes(data, aesKey, aesIv);
                    result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
                    
                } else { // 처리 안됨
                    result = "{\"result\":\"failure\",\"msg\":\"Error occured when read.\"}";
                } // End of if : 3
            } // End of if : 2
        } // End of if : 1
        return result;
    }

    @RequestMapping(value = "/insertCustData03", method = RequestMethod.POST)
    public String insertCustData03(HttpServletRequest req, @RequestBody String requestBody) throws JsonMappingException, JsonProcessingException {

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
        data = custService.decAes(requestBody, aesKey, aesIv);
        CustData03 custData03 = mapper.readValue(data, CustData03.class);
        custData03.setCompNo(compNo);
        
        check = custService.insertCustData03(custData03);

        if (check > 0) {
            result = "{\"result\":\"ok\"}";
        } else {
            result = "{\"result\":\"failure\" ,\"msg\":\"Error occured when write.\"}";
        }

        return result;
    }

    @RequestMapping(value = "/updateCustData03/{no}", method = RequestMethod.PUT)
    public String updateCustData03(HttpServletRequest req, @RequestBody String requestBody, @PathVariable String no) throws JsonMappingException, JsonProcessingException {
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
        data = soppService.decAes(requestBody, aesKey, aesIv);
        CustData03 custData03 = mapper.readValue(data, CustData03.class);
        custData03.setCompNo(compNo);

        if (custService.updateCustData03(custData03) > 0) {
            result = "{\"result\":\"ok\"}";
        }

        return result;
    }

    @RequestMapping(value = "/custSales/{no}", method = RequestMethod.GET)
    public String getCustSales(HttpServletRequest req, @PathVariable String no) {
        HttpSession session = null;
        String compId = null;
        int compNo = 0;
        String result = null;
        String userNo = null;
        List<Sales> list = null;
        String data = null;
        String aesKey, aesIv = null;
        int i = 0;

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
                Sales sales = new Sales();
                sales.setCompNo(compNo);
                sales.setCustNo(Integer.parseInt(no));
                list = custService.getCustSales(sales);
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
                data = custService.encAes(data, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";  
            } // End of if : 2
        } // End of if : 1
        return result;
    }

    @RequestMapping(value = "/custTech/{no}", method = RequestMethod.GET)
    public String getCustTech(HttpServletRequest req, @PathVariable String no) {
        HttpSession session = null;
        String compId = null;
        int compNo = 0;
        String result = null;
        String userNo = null;
        List<Tech> list = null;
        String data = null;
        String aesKey, aesIv = null;
        int i = 0;

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
                Tech tech = new Tech();
                tech.setCompNo(compNo);
                tech.setCustNo(Integer.parseInt(no));
                list = custService.getCustTech(tech);
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
                data = custService.encAes(data, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";  
            } // End of if : 2
        } // End of if : 1
        return result;
    }
}
