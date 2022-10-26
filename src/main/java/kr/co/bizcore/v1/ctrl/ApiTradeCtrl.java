package kr.co.bizcore.v1.ctrl;

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
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.bizcore.v1.domain.TradeDetail;
import kr.co.bizcore.v1.msg.Msg;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/trade")
@Slf4j
public class ApiTradeCtrl extends Ctrl{

    private static final Logger logger = LoggerFactory.getLogger(ApiTradeCtrl.class);

    @GetMapping("")
    public String ApiTradeGet(HttpServletRequest request){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        HttpSession session = null;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
        }else{
            result = tradeService.getTradeSummaryList(compId);
            result = encAes(result, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
        }

        return result;
    }

    @GetMapping("/{no}")
    public String ApiTradeNumberGet(HttpServletRequest request, @PathVariable("no") String no){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        Msg msg = null;
        HttpSession session = null;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        msg = getMsg((String)session.getAttribute("lang"));
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
        }else{
            result = tradeService.getTradeDetailList(no);
            result = encAes(result, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
        }

        return result;
    }

    // 연결된 매입매출 자료를 가져오는 메서드
    @GetMapping("/{funcName}/{funcNo}")
    public String ApiTradeFuncGet(HttpServletRequest request, @PathVariable("funcName") String funcName, @PathVariable("funcNo") String funcNo){
        String result = null, data = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        Msg msg = null;
        HttpSession session = null;

        session = request.getSession();
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        compId = (String)session.getAttribute("compId");
        msg = getMsg((String)session.getAttribute("lang"));
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            data = tradeService.getTradeListByFunc(compId, funcName, funcNo);
            if(data != null){
                data = encAes(data, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"" + data + "\"}";
            }else{
                result = "{\"result\":\"failure\",\"msg\":\"" + msg.unknownError + "\"}";
            }
            
        }

        return result;
    }

    @DeleteMapping("/{no}")
    public String ApiTradeNumberDelete(HttpServletRequest request, @PathVariable("no") String no){
        String result = null;
        String compId = null;
        HttpSession session = null;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else if(tradeService.removeTradeDetail(no)){
            result = "{\"result\":\"ok\"}";
        }else{
            result = "{\"result\":\"failure\",\"msg\":\"Not Exist.\"}";
        }

        return result;
    }

    //@PostMapping("")
    public String ApiTradePost(HttpServletRequest request, @RequestBody String requestBody) throws JsonMappingException, JsonProcessingException{
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String data = null;
        ObjectMapper mapper = null;
        TradeDetail detail = null;
        HttpSession session = null;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
        }else{
            data = decAes(requestBody, aesKey, aesIv);
            detail = mapper.readValue(data, TradeDetail.class);
            if(tradeService.addTradeDetail(detail)){
                result = "{\"result\":\"ok\"}";
            }else{
                result = "{\"result\":\"failure\",\"msg\":\"An error occurred.\"}";
            }
        }

        return result;
    }

    //@PutMapping("{no}")
    public String ApiTradePut(HttpServletRequest request, @RequestBody String requestBody, @PathVariable("no") String no) throws JsonMappingException, JsonProcessingException{
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String data = null;
        ObjectMapper mapper = null;
        TradeDetail detail = null;
        HttpSession session = null;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
        }else{
            data = decAes(requestBody, aesKey, aesIv);
            detail = mapper.readValue(data, TradeDetail.class);
            if(tradeService.modifyTradeDetail(no, detail)){
                result = "{\"result\":\"ok\"}";
            }else{
                result = "{\"result\":\"failure\",\"msg\":\"An error occurred.\"}";
            }
        }

        return result;
    }
    
}
