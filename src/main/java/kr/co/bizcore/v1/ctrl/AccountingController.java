package kr.co.bizcore.v1.ctrl;

import javax.servlet.http.HttpServletRequest;

import org.mybatis.logging.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/accounting")
@Slf4j
public class AccountingController extends Ctrl{

    private static final org.mybatis.logging.Logger logger = LoggerFactory.getLogger(AccountingController.class);

    @GetMapping("/slip") // 전표관리
    public String accSlip(HttpServletRequest request){
        doIt(request);
        return "";
    }

    @GetMapping("/trade") // 매입매출
    public String accㅆㄱㅁㅇㄷ(HttpServletRequest request){
        doIt(request);
        return "";
    }

    @GetMapping("/unpaid") // 미지급현황
    public String accㅕㅞ먕(HttpServletRequest request){
        doIt(request);
        return "";
    }

    @GetMapping("/receivable") // 미수금현황
    public String accReceivable(HttpServletRequest request){
        doIt(request);
        return "";
    }

    @GetMapping("/sales") // 매출원장
    public String accSales(HttpServletRequest request){
        doIt(request);
        return "";
    }

    @GetMapping("/purchase") // 매입원장
    public String accPurchase(HttpServletRequest request){
        doIt(request);
        return "";
    }

    @GetMapping("/bankaccount") // 은행예금
    public String accBankAccount(HttpServletRequest request){
        doIt(request);
        return "";
    }

    @GetMapping("/corporatecard") // 법인카드
    public String accCorporateCard(HttpServletRequest request){
        doIt(request);
        return "";
    }

    @GetMapping("/purchasebill") // 세금계산서-매입
    public String accBillPurchase(HttpServletRequest request){
        doIt(request);
        return "";
    }

    @GetMapping("/salesbill") // 세금계산서-매출
    public String accBillSales(HttpServletRequest request){
        doIt(request);
        return "";
    }
    
}