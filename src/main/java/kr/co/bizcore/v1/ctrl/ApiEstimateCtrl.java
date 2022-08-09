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
        String list = null;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        compId = (String) session.getAttribute("compId");
        if (compId == null)
            compId = (String) request.getAttribute("compId");

        if (compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is not verified.\"}";
        } else
            list = soppService.getEstimateList(compId);
            if (list == null) {
                result = "{\"result\":\"failure\",\"msg\":\"list is empty\"}";
            } else {
                list = soppService.encAes(list, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + list + "\"}";
            }
        return result;
    } // End of apiEstimateGet

    @GetMapping("/{no}")
    public String apiEstimateNumberGet(HttpServletRequest request, @PathVariable String no){
        String result = null, aesKey = null, aesIv = null, compId = null;
        HttpSession session = null;
        Estimate estimate = null;
        String list = null;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        compId = (String) session.getAttribute("compId");
        if (compId == null)
            compId = (String) request.getAttribute("compId");

        if (compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is not verified.\"}";
        } else
            estimate = soppService.getEstimate(no, compId);
            if (estimate == null) {
                result = "{\"result\":\"failure\",\"msg\":\"Not exist\"}";
            } else {
                list = soppService.encAes(estimate.toJson(), aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + list + "\"}";
            }
        return result;
    } // End of apiEstimateNumberGet
    
}
