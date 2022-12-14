package kr.co.bizcore.v1.ctrl;

import java.io.UnsupportedEncodingException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

    @GetMapping("")
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
            list = estimateSvc.getEstimateList(compId);
            if (list == null) {
                result = "{\"result\":\"failure\",\"msg\":\"" + msg.noResult + "\"}";
            } else {
                list = encAes(list, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + list + "\"}";
            }
        return result;
    } // End of apiEstimateGet

    @GetMapping("/{estmNo}")
    public String apiEstimateEstmnoGet(HttpServletRequest request, @PathVariable String estmNo){
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
            list = estimateSvc.getEstmVersionList(compId, estmNo, aesKey, aesIv);
            if (list == null) {
                result = "{\"result\":\"failure\",\"msg\":\"" + msg.noResult + "\"}";
            } else {
                list = encAes(list, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + list + "\"}";
            }
        return result;
    } // End of apiEstimateGet

    @GetMapping("/basic")
    public String apiEstimateFormGet(HttpServletRequest request){
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
            list = estimateSvc.getEstimateBasic(compId, aesKey, aesIv);
            if (list == null) {
                result = "{\"result\":\"failure\",\"msg\":\"" + msg.noResult + "\"}";
            } else {
                list = encAes(list, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + list + "\"}";
            }
        return result;
    } // End of apiEstimateFormGet

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

    //@GetMapping("/{no}")
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

    @PostMapping({"","/{estmNo}"})
    public String apiEstimatePost(HttpServletRequest request, @RequestBody String requestBody, @PathVariable(required = false) String estmNo){
        String result = null, aesKey = null, aesIv = null, compId = null, data = null, userNo = null, no = null;
        HttpSession session = null;
        JSONObject json = null;
        Msg msg = null;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        userNo = (String) session.getAttribute("userNo");
        msg = getMsg((String)session.getAttribute("lang"));
        compId = (String) session.getAttribute("compId");
        if (compId == null)
            compId = (String) request.getAttribute("compId");

        if (compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.unknownError + "\"}";
            data = decAes(requestBody, aesKey, aesIv);
            json = new JSONObject(data);
            no = estimateSvc.saveEstimate(compId, userNo, json, estmNo);
        }
            
        return result;
    } // End of apiEstimateNumberGet

    @GetMapping("/sopp/{sopp:\\d+}")
    public String apiEstimateSoppNoGet(HttpServletRequest request, @PathVariable("sopp") int sopp){
        String result = null, aesKey = null, aesIv = null, compId = null, list = null;;
        HttpSession session = null;
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
            list = estimateSvc.getEstimateList(compId, sopp);
            if (list == null) {
                result = "{\"result\":\"failure\",\"msg\":\"" + msg.noResult + "\"}";
            } else {
                list = encAes(list, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + list + "\"}";
            }
        return result;
    } // End of apiEstimateGet
    
}
