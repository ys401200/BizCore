package kr.co.bizcore.v1.ctrl;

import java.util.Calendar;

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

import kr.co.bizcore.v1.msg.Msg;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/accounting")
@Slf4j
public class ApiAccountingCtrl extends Ctrl{

    private static final Logger logger = LoggerFactory.getLogger(ApiAccountingCtrl.class);

    @GetMapping("/taxbill/{option}")
    public String apiAccTaxBillOption(HttpServletRequest request, @PathVariable String option){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String lang = null;
        Msg msg = null;
        HttpSession session = null;

        session = request.getSession();
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        compId = (String)session.getAttribute("compId");
        lang = (String)session.getAttribute("lang");
        msg = getMsg(lang);
        if(compId == null)  compId = (String)session.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else if(option.equals("all") || option.equals("remain")){
            result = accService.getSimpleTaxBillList(compId, option.equals("all"));
            result = encAes(result, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
        }else{
            result = accService.getTaxBill(compId, option);
            result = encAes(result, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
        }
        
        return result;
    } // End of apiAccTaxBillOption()

    // 월,분기,연간 매출 차트를 보여주기 위한 메서드
    @GetMapping("/statistics/sales/{date:\\d+}")
    public String apiAccStatistics(HttpServletRequest request, @PathVariable int date){
        String result = null;
        String compId = null, aesKey = null, aesIv = null, data = null, lang = null;
        Msg msg = null;
        int y = -1, year;
        HttpSession session = null;

        session = request.getSession();
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        lang = (String)session.getAttribute("lang");
        msg = getMsg(lang);
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)session.getAttribute("compId");

        year = date / 10000;
        y = Calendar.getInstance().get(Calendar.YEAR);
        
        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else if(y < year - 5 || y > year + 5){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.wrongDateFormat + "\"}";
        }else{
            data = accService.getSalesStatisticsWithYear(compId, year);
            data = encAes(data, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
        }
        
        return result;
    } // End of apiAccTaxBillOption()

    @GetMapping("/bankaccount")
    public String getBankAccountList(HttpServletRequest request){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String lang = null;
        Msg msg = null;
        HttpSession session = null;

        session = request.getSession();
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        compId = (String)session.getAttribute("compId");
        lang = (String)session.getAttribute("lang");
        msg = getMsg(lang);
        if(compId == null)  compId = (String)session.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            result = accService.getBankAccountList(compId);
            result = encAes(result, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
        }
        
        return result;
    }


    @GetMapping("/bankdetail/{bank:\\d+}/{account:[0-9,-]{1,}}")
    public String getBankAccountDetail(HttpServletRequest request, @PathVariable("bank") String bank, @PathVariable("account") String account){
        String result = null;
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
        if(compId == null)  compId = (String)session.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            result = accService.getBankDetail(compId, bank, account);
            if(result == null){
                result = "{\"result\":\"failure\",\"msg\":\"" + msg.noResult + "\"}";
            }else{
                result = encAes(result, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
            }
        }
        
        return result;
    }

    @PostMapping("/bankdetail/memo/{bank:\\d+}/{account:[0-9,-]{1,}}")
    public String setBankAccHistoryMemo(HttpServletRequest request, @RequestBody String requestBody, @PathVariable("bank") String bank, @PathVariable("account") String account){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String data = null;
        String memo = null, desc = null;
        long deposit = -1, withdraw = -1, balance = -1, dt = -1;
        boolean b = false;
        Msg msg = null;
        HttpSession session = null;
        JSONObject json = null;

        session = request.getSession();
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        compId = (String)session.getAttribute("compId");
        msg = getMsg((String)session.getAttribute("lang"));
        if(compId == null)  compId = (String)session.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            result = "{\"result\":\"failure\"}";
            data = decAes(requestBody, aesKey, aesIv);
            json = new JSONObject(data);
            memo = json.getString("memo");
            desc = json.getString("desc");
            deposit = json.getLong("deposit");
            withdraw = json.getLong("withdraw");
            balance = json.getLong("balance");
            dt = json.getLong("dt");
            b = accService.setBankAccMemo(compId, bank, account, memo, desc, dt, deposit, withdraw, balance);
            if(b){
                result = "{\"result\":\"ok\"}";
            }
        }
        
        return result;
    }
    
}
