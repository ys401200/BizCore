package kr.co.bizcore.v1.ctrl;

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

import kr.co.bizcore.v1.domain.Unpaid;
import kr.co.bizcore.v1.msg.Msg;
import kr.co.bizcore.v1.svc.UnpaidService;
import lombok.extern.slf4j.Slf4j;

@RequestMapping("/api/unpaid")
@RestController
@Slf4j
public class ApiUnpaidCtrl extends Ctrl {
    private static final Logger logger = LoggerFactory.getLogger(ApiUnpaidCtrl.class);

    @Autowired
    private UnpaidService unpaidService;

    @GetMapping("")
    public String unpaidList(HttpServletRequest request) {
        String result = null, data = null, aesKey = null, aesIv = null, userNo = null, compId = null;
        int compNo = 0;
        HttpSession session = null;
        Msg msg = null;
        List<Unpaid> list = null;
        int i = 0;
        String selectYear = null;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        compNo = (int) session.getAttribute("compNo");
        userNo = (String) session.getAttribute("userNo");
        msg = getMsg((String) session.getAttribute("lang"));
        selectYear = (String) session.getAttribute("selectYear");
        if (compNo == 0)
            compNo = (int) request.getAttribute("compNo");

        if (compNo == 0) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compNoNotVerified + "\"}";
        } else if (aesKey == null || aesIv == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        } else {
            Unpaid unpaid = new Unpaid();
            unpaid.setCompNo(compNo);
            list = unpaidService.getUnpaidList(unpaid, compNo, selectYear);

            if (list != null) {
                data = new Gson().toJson(list).toString();
            } else {
                data = "[]";
            }

            data = unpaidService.encAes(data, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
        }

        return result;
    }

    // @RequestMapping(value = "/{no}", method = RequestMethod.GET)
    // public String getDetail(HttpServletRequest req, @PathVariable String no) {
    // HttpSession session = null;
    // String compId = null;
    // int compNo = 0;
    // String result = null;
    // String userNo = null;
    // Unpaid unpaid = null;
    // String data = null;
    // String aesKey, aesIv = null;

    // if (no == null) { // 글 번호 확인 안됨
    // result = "{\"result\":\"failure\",\"msg\":\"unpaidNo is not exist\"}";
    // } else { // 글 번호 확인 됨
    // session = req.getSession();
    // compId = (String) session.getAttribute("compId");
    // compNo = (int) session.getAttribute("compNo");
    // aesKey = (String) session.getAttribute("aesKey");
    // aesIv = (String) session.getAttribute("aesIv");
    // if (compId == null)
    // compId = (String) req.getAttribute("compId");
    // userNo = (String) session.getAttribute("userNo");

    // if (compId == null) { // 회사코드 확인 안됨
    // result = "{\"result\":\"failure\",\"msg\":\"Company ID is not verified.\"}";
    // } else if (userNo == null) {
    // result = "{\"result\":\"failure\",\"msg\":\"Session expired and/or Not logged
    // in.\"}";
    // } else { // 회사코드 확인 됨
    // unpaid = unpaidService.getUnpaid(compNo, no); // 삭제(update) 카운트를 실제 삭제 여부를
    // 확인함

    // if (unpaid != null) { // 처리됨
    // data = unpaid.toJson();
    // data = unpaidService.encAes(data, aesKey, aesIv);
    // result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";

    // } else { // 처리 안됨
    // result = "{\"result\":\"failure\",\"msg\":\"Error occured when read.\"}";
    // } // End of if : 3
    // } // End of if : 2
    // } // End of if : 1
    // return result;
    // }

    // @RequestMapping(value = "", method = RequestMethod.POST)
    // public String insert(HttpServletRequest req, @RequestBody String requestBody)
    // throws JsonMappingException, JsonProcessingException {

    // int compNo = 0;
    // HttpSession session = null;
    // String result = null;
    // String data = null, aesKey = null, aesIv = null;
    // ObjectMapper mapper = new ObjectMapper();
    // int check = 0;

    // session = req.getSession();

    // aesKey = (String) session.getAttribute("aesKey");
    // aesIv = (String) session.getAttribute("aesIv");
    // compNo = (int) session.getAttribute("compNo");
    // data = unpaidService.decAes(requestBody, aesKey, aesIv);
    // Unpaid unpaid = mapper.readValue(data, Unpaid.class);
    // unpaid.setCompNo(compNo);

    // check = unpaidService.insertUnpaid(unpaid);

    // if (check > 0) {
    // result = "{\"result\":\"ok\"}";
    // } else {
    // result = "{\"result\":\"failure\" ,\"msg\":\"Error occured when write.\"}";
    // }

    // return result;

    // }

    // @RequestMapping(value = "/{no}", method = RequestMethod.PUT)
    // public String update(HttpServletRequest req, @RequestBody String requestBody,
    // @PathVariable String no)
    // throws JsonMappingException, JsonProcessingException {
    // String compId = null;
    // int compNo = 0;
    // String result = null;
    // HttpSession session = null;
    // String data = null, aesKey = null, aesIv = null;
    // ObjectMapper mapper = new ObjectMapper();

    // session = req.getSession();
    // compNo = (int) session.getAttribute("compNo");
    // compId = (String) session.getAttribute("compId");
    // if (compId == null) {
    // compId = (String) req.getAttribute("compId");
    // }

    // aesKey = (String) session.getAttribute("aesKey");
    // aesIv = (String) session.getAttribute("aesIv");
    // data = unpaidService.decAes(requestBody, aesKey, aesIv);
    // Unpaid unpaid = mapper.readValue(data, Unpaid.class);
    // unpaid.setCompNo(compNo);
    // logger.info(unpaid.toString());

    // if (unpaidService.updateUnpaid(unpaid) > 0) {
    // result = "{\"result\":\"ok\"}";
    // }

    // return result;

    // }
}
