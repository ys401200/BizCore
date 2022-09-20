package kr.co.bizcore.v1.svc;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

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
    
}
