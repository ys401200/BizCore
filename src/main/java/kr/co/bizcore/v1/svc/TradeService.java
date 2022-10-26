package kr.co.bizcore.v1.svc;

import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.TradeDetail;
import kr.co.bizcore.v1.domain.TradeSummary;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class TradeService extends Svc{
    private static final Logger logger = LoggerFactory.getLogger(TradeService.class);

    public String getTradeListByFunc(String compId, String funcName, String funcNo) {
        String result = null, t = null;
        List<HashMap<String, String>> list = null;
        HashMap<String, String> each = null;
        int x = 0, qty = 0, price = 0;
        long total = 0;

        if(funcName == null || funcNo == null)  return null;

        list = tradeMapper.getTradeByFunc(compId, funcName + ":" + funcNo);
        result = "[";
        for(x = 0 ; x < list.size() ; x++){
            each = list.get(x);
            price = strToInt(each.get("price"));
            qty = strToInt(each.get("qty"));
            total = (long)qty * (long)price;
            t =("{\"no\":" + each.get("no") + ","); 
            t +=("\"dt\":" + each.get("dt") + ","); 
            t +=("\"writer\":" + each.get("writer") + ","); 
            t +=("\"type\":\"" + each.get("type") + "\",");
            t +=("\"product\":" + (each.get("product") == null ? "null" : "\"" + each.get("product") + "\"") + ",");
            t +=("\"customer\":" + (each.get("customer") == null ? "null" : "\"" + each.get("customer") + "\"") + ",");
            t +=("\"type\":\"" + each.get("type") + "\",");
            t +=("\"taxbill\":\"" + (each.get("taxbill") == null ? "null" : "\"" + each.get("taxbill") + "\"") + "\",");
            t +=("\"title\":\"" + each.get("title") + "\",");
            t +=("\"qty\":" + qty + ",");
            t +=("\"price\":" + price + ",");
            t +=("\"total\":" + total + ",");
            t +=("\"vat\":" + each.get("vat") + ","); 
            t +=("\"remark\":\"" + (each.get("remark") == null ? "null" : "\"" + each.get("remark") + "\"") + "\","); 
            t +=("\"created\":" + each.get("created") + "}"); 
            if(x > 0)   result += ",";
            result += t;
        }
        result += "]";
        return result;
    }

    // ↓↓↓↓↓↓↓↓↓↓↓↓ 2022. 10. 23 이전  작업분량↓↓↓↓↓↓↓↓↓↓↓↓

    public String getTradeSummaryList(String compId){
        String result = null;
        List<TradeSummary> list = null;

        list = tradeMapper.getTradeListXXXXX(compId);
        for(TradeSummary each : list){
            if(result == null)  result = "[";
            else                result += ",";
            result += each.toJson();
        }
        if(result != null)  result += "]";
        return result;
    }

    public String getTradeDetailList(String no){
        String result = null;
        List<TradeDetail> list = null;

        list = tradeMapper.getTradeDetailListXXXXX(no);
        for(TradeDetail each : list){
            if(result == null)  result = "[";
            else                result += ",";
            result += each.toJson();
        }
        if(result != null)  result += "]";
        return result;
    }

    public TradeDetail getTradeDetail(String no){
        TradeDetail result = null;
        result = tradeMapper.getTradeDetailXXXXX(no);
        return result;
    }

    public boolean removeTradeDetail(String no){
        int count = -1;
        count = tradeMapper.removeTradeDetailXXXXX(no);
        return count > 0;
    }

    public boolean modifyTradeDetail(String no, TradeDetail detail){
        int count = -1;
        String sql = null;
        TradeDetail ogn = null;

        ogn = getTradeDetail(no);
        sql = ogn.createUpdateQuery(detail, null);
        sql = sql + " WHERE soppdatano = " + no;
        count = executeSqlQuery(sql);

        return count > 0;
    }

    public boolean addTradeDetail(TradeDetail detail){
        int count = -1;
        String sql = null;
        sql = detail.createInsertQuery(null,null);
        count = executeSqlQuery(sql);
        return count > 0;
    }

    
    
}
