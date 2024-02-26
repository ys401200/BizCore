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

import kr.co.bizcore.v1.domain.Unpaid;
import kr.co.bizcore.v1.domain.UnpaidSub;
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
        List<UnpaidSub> sub = null;
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
            sub = unpaidService.getUnpaidSub(selectYear);

            for (int i = 0; i < sub.size(); i++) {
                for (int s = 0; s < list.size(); s++) {
                    if (sub.get(i).getCustNo() == list.get(s).getCustNo()) {
                        list.get(s).setSerialTotalB(sub.get(i).getModal_receive_data());
                    }
                }
            }
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

}
