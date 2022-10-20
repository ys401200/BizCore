package kr.co.bizcore.v1.ctrl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.bizcore.v1.domain.Estimate;
import kr.co.bizcore.v1.msg.Msg;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/estimate")
@Slf4j
public class ApiEstimateCtrl extends Ctrl {

    private static final Logger logger = LoggerFactory.getLogger(ApiEstimateCtrl.class);

    @GetMapping("/form")
    public String apiEstimateGet(HttpServletRequest request){
        String result = null, aesKey = null, aesIv = null, compId = null;
        HttpSession session = null;
        String list = null, lang = null;
        Msg msg = null;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        lang = (String)session.getAttribute("lang");
        msg = getMsg(lang);
        compId = (String) session.getAttribute("compId");
        if (compId == null)
            compId = (String) request.getAttribute("compId");

        if (compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        } else
            list = estimateSvc.getEstimateForms(compId);
            if (list == null) {
                result = "{\"result\":\"failure\",\"msg\":\"" + msg.noResult + "\"}";
            } else {
                list = encAes(list, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + list + "\"}";
            }
        return result;
    } // End of apiEstimateGet

    @GetMapping("/item")
    public String apiEstimateNumberGet(HttpServletRequest request){
        String result = null, aesKey = null, aesIv = null, compId = null;
        HttpSession session = null;
        String list = null;
        Msg msg = null;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        msg = getMsg((String)session.getAttribute("lang"));
        compId = (String) session.getAttribute("compId");
        if (compId == null)
            compId = (String) request.getAttribute("compId");

        if (compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        } else
            list = estimateSvc.getItems(compId);
            list = encAes(list, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + list + "\"}";
        return result;
    } // End of apiEstimateNumberGet

    @GetMapping("/{no}")
    public String apiEstimateNumberGet(HttpServletRequest request, @PathVariable String no){
        String result = null, aesKey = null, aesIv = null, compId = null;
        HttpSession session = null;
        Estimate estimate = null;
        String list = null, lang = null;
        Msg msg = null;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        lang = (String)session.getAttribute("lang");
        msg = getMsg(lang);
        compId = (String) session.getAttribute("compId");
        if (compId == null)
            compId = (String) request.getAttribute("compId");

        if (compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        } else
            estimate = soppService.getEstimate(no, compId);
            if (estimate == null) {
                result = "{\"result\":\"failure\",\"msg\":\"" + msg.noResult + "\"}";
            } else {
                list = soppService.encAes(estimate.toJson(), aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + list + "\"}";
            }
        return result;
    } // End of apiEstimateNumberGet
    
}
