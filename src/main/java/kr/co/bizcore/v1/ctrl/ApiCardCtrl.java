package kr.co.bizcore.v1.ctrl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.tomcat.util.json.JSONParser;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.bizcore.v1.msg.Msg;
import kr.co.bizcore.v1.svc.CardService;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/card")
@Slf4j
public class ApiCardCtrl extends Ctrl {
    private static final Logger logger = LoggerFactory.getLogger(ApiBoardCtrl.class);
    @Autowired
    private CardService cardService;

    @GetMapping("/list")
    public String getCardList(HttpServletRequest request) {
        String result = null, compId = null, lang = null, data = null, aesKey = null, aesIv = null;
        ;
        HttpSession session;
        Msg msg = null;
        session = request.getSession();
        session = request.getSession();
        compId = (String) session.getAttribute("compId");
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        msg = getMsg(lang);

        if (compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        } else {
            data = cardService.getCardList(compId);
            data = encAes(data, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
        }

        return result;
    }

    // 엑셀 파일 내역 db에 insert
    @PostMapping("/insert")
    public String insertCardData(HttpServletRequest request, @RequestBody String requestBody) {
        String result = null, compId = null, aesKey = null, aesIv = null;
        String data = null, lang = null;
        String transactionDate = null, cardNo = null, permitNo = null, storeTitle = null, permitAmount = null;
        HttpSession session = null;
        Msg msg = null;
        JSONObject json = null;
        int x = 0;
        session = request.getSession();
        compId = (String) session.getAttribute("compId");
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        lang = (String) session.getAttribute("lang");
        msg = getMsg(lang);

        if (compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        } else if (aesKey == null || aesIv == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        } else {
            data = decAes(requestBody, aesKey, aesIv);
            if (data == null) {
                result = "{\"result\":\"failure\",\"msg\":\"" + msg.dataIsWornFormat + "\"}";
            } else {
                json = new JSONObject(data);
                transactionDate = json.getString("transactionDate");
                cardNo = json.getString("cardNo");
                permitNo = json.getString("permitNo");
                storeTitle = json.getString("storeTitle");
                permitAmount = json.getString("permitAmount");

                x = cardService.insertCardData(compId, transactionDate, cardNo, permitNo, storeTitle, permitAmount);

                if (x > 0) {
                    result = "{\"result\":\"ok\"}";
                } else {
                    result = "{\"result\":\"failure\"}";
                }
            }
        }

        return result;
    }

}
