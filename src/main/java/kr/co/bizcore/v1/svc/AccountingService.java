package kr.co.bizcore.v1.svc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.BankAccount;
import kr.co.bizcore.v1.domain.SimpleTaxBill;
import kr.co.bizcore.v1.domain.TaxBill;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AccountingService extends Svc{

    private static final Logger logger = LoggerFactory.getLogger(AccountingService.class);

    public String getSimpleTaxBillList(String compId, boolean all){
        String result = null;
        List<SimpleTaxBill> list = null;
        
        list = accMapper.getSimpleTaxBillList(compId, all);
        for(SimpleTaxBill bill : list){
            if(result == null)  result = "[";
            else                result += ",";
            result += bill.toJson();
        }
        if(result != null)  result += "]";
        return result;
    }

    public String getTaxBill(String compId, String no){
        String result = null;
        TaxBill bill = null;
        
        bill = accMapper.getTaxBill(no, compId);
        
        if(bill != null)  result = bill.toJson();
        return result;
    }

    public String getSalesStatisticsWithYear(String compId, int year){
        String result = null;
        int x = 0, y = 0;;
        List<HashMap<String, String>> list = null;
        ArrayList<String> t = null;
        HashMap<String, String> each = null;
        String sales = null, purchase = null;

        list = accMapper.getSalesStatisticsWithYear(compId, year);
        t = new ArrayList<>();
        if(list != null && list.size() > 0) while(x < list.size()){
            each = list.get(x);

            // DB에서 가져온 값 중 특정월의 데이터가 없는 경우 베열의 인덱스가 틀어질 수 있으르모 월을 검증하고 불일치할 경우 0을 가지는 월을 추가하도록 함
            y = strToInt(each.get("m")) - 1;
            if(x == y){
                t.add("{\"sales\":" + each.get("v1") + ",\"purchase\":" + each.get("v2") + "}");
                x++;
            }else{
                t.add("{\"sales\":0,\"purchase\":0}");
            }
        }
        
        result = "[";
        for(x = 0 ; x < t.size() ; x++){
            if(x > 0)   result += ",";
            result += t.get(x);
        }
        result += "]";

        return result;
    } // End of getTradeAmount()

    // 은행 계좌 목록을 가져오는 메서드
    public String getBankAccountList(String compId){
        String result = null;
        List<BankAccount> list = null;
        int x = 0;

        list = accMapper.getBankAccountList(compId);
        result = "[";
        if(list != null)    for(x = 0 ; x < list.size() ; x++){
            if(x > 0)   result += ",";
            result += list.get(x).toJson();
        }
        result += "]";

        return result;
    }

    // 은행 거래내역을 가져오는 메서드
    public String getBankDetail(String compId, String bank, String account){
        String result = null;
        List<HashMap<String, String>> list = null;
        HashMap<String, String> each = null;
        int x = 0;

        list = accMapper.getBankDetail(compId, bank, account);
        if(list != null && list.size() > 0) for(x = 0  ;x < list.size() ; x++){
            each = list.get(x);
            if(x == 0)  result = "[";
            else        result += ",";
            result += ("{\"dt\":" + each.get("dt") + ",");
            result += ("\"desc\":\"" + each.get("desc") + "\",");
            result += ("\"deposit\":" + each.get("deposit") + ",");
            result += ("\"withdraw\":" + each.get("withdraw") + ",");
            result += ("\"balance\":" + each.get("balance") + ",");
            result += ("\"branch\":\"" + each.get("branch") + "\",");
            result += ("\"memo1\":" + (each.get("memo1") == null ? "null" : "\"" + each.get("memo1") + "\"") + ",");
            result += ("\"memo2\":" + (each.get("memo2") == null ? "null" : "\"" + each.get("memo2") + "\"") + ",");
            result += ("\"link\":\"" + each.get("link") + "\"}");

        }
        if(result != null)  result += "]";
        return result;
    }

    // 은행 거래내역의 메모를 업데이트하는 메서드
    public boolean setBankAccMemo(String compId, String bank, String account, String memo, String desc, long dt, long deposit, long withdraw, long balance){
        boolean result = false;
        int x = -1;
        x = accMapper.updateBankAccHistoryMemo(compId, bank, account, dt, memo, deposit, withdraw, balance, desc);
        logger.error("|||||||||||||||||||||||||||||||||" + x);
        result = x > 0;
        return result;
    }

    // 은행 거래내역의 메모를 업데이트하는 메서드
    public boolean setBankAccMemo2(String compId, String bank, String account, String memo, String desc, long dt, long deposit, long withdraw, long balance){
        boolean result = false;
        String sql = "UPDATE bizcore.bank_account_ledger SET memo2 = ? WHERE deleted IS NULL AND compId = ? AND bank = ? AND account = ? AND UNIX_TIMESTAMP(dt)*1000 = ? AND deposit = ? AND withdraw = ? AND balance = ? AND `desc` = ?";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        int x = -1;

        logger.error("||||||||||||||||||||||||||||||||| compId : " + compId);
        logger.error("||||||||||||||||||||||||||||||||| bank : " + bank);
        logger.error("||||||||||||||||||||||||||||||||| account : " + account);
        logger.error("||||||||||||||||||||||||||||||||| memo : " + memo);
        logger.error("||||||||||||||||||||||||||||||||| deposit : " + deposit);
        logger.error("||||||||||||||||||||||||||||||||| withdraw : " + withdraw);
        logger.error("||||||||||||||||||||||||||||||||| balance : " + balance);
        logger.error("||||||||||||||||||||||||||||||||| desc : " + desc);
        logger.error("||||||||||||||||||||||||||||||||| dt : " + dt);
        
        try{
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, memo);
            pstmt.setString(2, compId);
            pstmt.setString(3, bank);
            pstmt.setString(4, account);
            pstmt.setLong(5, dt);
            pstmt.setLong(6, deposit);
            pstmt.setLong(7, withdraw);
            pstmt.setLong(8, balance);
            pstmt.setString(9, desc);
            x = pstmt.executeUpdate();
        }catch(SQLException e){e.printStackTrace();}

        logger.error("||||||||||||||||||||||||||||||||| 2 : " + x);
        result = x > 0;
        return result;
    }
    
}
