package kr.co.bizcore.v1.ctrl;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;

import kr.co.bizcore.v1.domain.Receivable;
import kr.co.bizcore.v1.domain.ReceivableSub;
import kr.co.bizcore.v1.msg.Msg;
import kr.co.bizcore.v1.svc.ReceivableService;
import lombok.extern.slf4j.Slf4j;

@RequestMapping("/api/receivable")
@RestController
@Slf4j
public class ApiReceivableCtrl extends Ctrl {
    private static final Logger logger = LoggerFactory.getLogger(ApiReceivableCtrl.class);

    @Autowired
    private ReceivableService receivableService;

    @GetMapping("")
    public String receivableList(HttpServletRequest request) {
        String result = null, data = null, aesKey = null, aesIv = null, userNo = null, compId = null;
        int compNo = 0;
        HttpSession session = null;
        Msg msg = null;
        List<Receivable> list = null;
        List<ReceivableSub> sub = null;
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
            Receivable receivable = new Receivable();
            receivable.setCompNo(compNo);
            list = receivableService.getReceivableList(receivable, compNo, selectYear);
            sub = receivableService.getReceivableSub(selectYear);

            for (int i = 0; i < sub.size(); i++) {
                for (int s = 0; s < list.size(); s++) {
                    if (sub.get(i).getCustNo() == list.get(s).getCustNo()) {
                        list.get(s).setSerialTotalS(sub.get(i).getModal_receive_data());
                    }
                }
            }
            if (list != null) {
                data = new Gson().toJson(list).toString();
            } else {
                data = "[]";
            }

            data = receivableService.encAes(data, aesKey, aesIv);
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
    // Receivable receivable = null;
    // String data = null;
    // String aesKey, aesIv = null;

    // if (no == null) { // 글 번호 확인 안됨
    // result = "{\"result\":\"failure\",\"msg\":\"receivableNo is not exist\"}";
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
    // receivable = receivableService.getReceivable(compNo, no); // 삭제(update) 카운트를
    // 실제 삭제 여부를
    // 확인함

    // if (receivable != null) { // 처리됨
    // data = receivable.toJson();
    // data = receivableService.encAes(data, aesKey, aesIv);
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
    // data = receivableService.decAes(requestBody, aesKey, aesIv);
    // Receivable receivable = mapper.readValue(data, Receivable.class);
    // receivable.setCompNo(compNo);

    // check = receivableService.insertReceivable(receivable);

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
    // data = receivableService.decAes(requestBody, aesKey, aesIv);
    // Receivable receivable = mapper.readValue(data, Receivable.class);
    // receivable.setCompNo(compNo);
    // logger.info(receivable.toString());

    // if (receivableService.updateReceivable(receivable) > 0) {
    // result = "{\"result\":\"ok\"}";
    // }

    // return result;

    // }
}
