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
public class AccountingController extends Ctrl {

    private static final org.mybatis.logging.Logger logger = LoggerFactory.getLogger(AccountingController.class);

    @GetMapping("/slip") // 전표관리
    public String accSlip(HttpServletRequest request) {
        doIt(request);
        return "/accounting/slip";
    }

    @GetMapping("/trade") // 매입매출
    public String accTrade(HttpServletRequest request) {
        doIt(request);
        return "/accounting/trade";
    }

    @GetMapping("/unpaid") // 미지급현황
    public String accUnpaid(HttpServletRequest request) {
        doIt(request);
        return "/accounting/unpaid";
    }

    @GetMapping("/receivable") // 미수금현황
    public String accReceivable(HttpServletRequest request) {
        doIt(request);
        return "/accounting/receivable";
    }

    @GetMapping("/sales") // 매출원장
    public String accSales(HttpServletRequest request) {
        doIt(request);
        return "/accounting/sales";
    }

    @GetMapping("/purchase") // 매입원장
    public String accPurchase(HttpServletRequest request) {
        doIt(request);
        return "/accounting/purchase";
    }

    @GetMapping("/bankaccount") // 은행예금
    public String accBankAccount(HttpServletRequest request) {
        doIt(request);
        return "/accounting/bankaccount";
    }

    @GetMapping("/corporatecard") // 법인카드
    public String accCorporateCard(HttpServletRequest request) {
        doIt(request);
        return "/accounting/corporatecard";
    }

    @GetMapping("/carddatainsert")
    public String accCarddatainsert(HttpServletRequest request) {
        doIt(request);
        return "/accounting/carddatainsert";
    }

    @GetMapping("/billpurchase") // 세금계산서-매입
    public String accBillpurchase(HttpServletRequest request) {
        doIt(request);
        return "/accounting/billpurchase";
    }

    @GetMapping("/billsales") // 세금계산서-매출
    public String accBillsales(HttpServletRequest request) {
        doIt(request);
        return "/accounting/billsales";
    }

    @GetMapping("/detailtable") // 세금계산서 - 매입/매출 상세
    public String billDetail(HttpServletRequest request) {
        doIt(request);
        return "/accounting/detailtable";
    }

    @GetMapping("/vat") // 세금계산서 - 매입/매출 상세
    public String vat(HttpServletRequest request) {
        doIt(request);
        return "/accounting/vat";
    }

    @RequestMapping(value = { "/contract2", "/contract2/{no:\\d+}" })
    public String cont2(HttpServletRequest request) {
        doIt(request);
        return "/contract/contract2";
    }
}