package kr.co.bizcore.v1.ctrl;

import java.util.Calendar;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        HttpSession session = null;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)session.getAttribute("compId");
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
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
        String compId = null, aesKey = null, aesIv = null, data = null;
        int x = 0, y = 0, z = 0, year = -1;;
        HttpSession session = null;

        session = request.getSession();
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)session.getAttribute("compId");

        year = Calendar.getInstance().get(Calendar.YEAR);
        x = date / 10000;
        y = (date % 10000) / 100;
        z = date % 100;

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
        }else if(x < year - 5 || x > year + 5 || y > 12 || z > 31){
            result = "{\"result\":\"failure\",\"msg\":\"Wrong date format.\"}";
        }else{
            data = accService.getTradeAmount(compId, date);
            data = encAes(data, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
        }
        
        return result;
    } // End of apiAccTaxBillOption()
    
}
