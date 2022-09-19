package kr.co.bizcore.v1.svc;

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

    public String getTradeAmount(String compId, int date){
        String result = null;
        String start = null, end = null, dt = null, yearly = null, quarterly = null, monthly = null;
        int x = 0, y = 0, z = 0;
        HashMap<String, String> each = null;
        String sales = null, purchase = null;

        // ========== 월간 금액 조회 ==========
        x = date / 10000;
        y = (date % 10000) / 100;
        z = 1;

        start = x + "-" + y + "-" + z;

        if(y == 12){
            x++;
            y = 1;
        }else   y++;

        end = x + "-" + y + "-" + z;

        each = accMapper.getTotalAmountWithStartAndEndDate(compId, start, end);
        if(each != null){
            sales = each.get("sales");
            purchase = each.get("purchase");
        }
        monthly = "{\"sales\":" + (sales == null ? 0 : sales) + ",\"purchase\":" + (purchase == null ? 0 : purchase) + ",\"start\":\"" + start + "\",\"end\":\"" + end + "\"}";

        // ========== 분기 금액 조회 ==========
        x = date / 10000;
        y = (((date % 10000) / 100 - 1) / 3) * 3 + 1;
        z = 1;
        sales = null;
        purchase = null;

        start = x + "-" + y + "-" + z;

        if(y == 10) y = 1;
        else y = y + 3;

        end = x + "-" + y + "-" + z;

        each = accMapper.getTotalAmountWithStartAndEndDate(compId, start, end);
        if(each != null){
            sales = each.get("sales");
            purchase = each.get("purchase");
        }
        quarterly = "{\"sales\":" + (sales == null ? 0 : sales) + ",\"purchase\":" + (purchase == null ? 0 : purchase) + ",\"start\":\"" + start + "\",\"end\":\"" + end + "\"}";

        // ========== 연간 금액 조회 ==========
        x = date / 10000;
        y = 1;
        z = 1;
        sales = null;
        purchase = null;

        start = x + "-" + y + "-" + z;
        x++;
        end = x + "-" + y + "-" + z;

        each = accMapper.getTotalAmountWithStartAndEndDate(compId, start, end);
        if(each != null){
            sales = each.get("sales");
            purchase = each.get("purchase");
        }
        yearly = "{\"sales\":" + (sales == null ? 0 : sales) + ",\"purchase\":" + (purchase == null ? 0 : purchase) + ",\"start\":\"" + start + "\",\"end\":\"" + end + "\"}";

        result = "{\"monthly\":" + monthly + ",";
        result += ("\"quarterly\":" + quarterly + ",");
        result += ("\"yearly\":" + yearly + "}");

        return result;
    } // End of getTradeAmount()
    
}
