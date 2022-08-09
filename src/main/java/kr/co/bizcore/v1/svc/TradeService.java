package kr.co.bizcore.v1.svc;

import java.util.List;

import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.TradeDetail;
import kr.co.bizcore.v1.domain.TradeSummary;

@Service
public class TradeService extends Svc{

    public String getTradeSummaryList(String compId){
        String result = null;
        List<TradeSummary> list = null;

        list = tradeMapper.getTradeList(compId);
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

        list = tradeMapper.getTradeDetailList(no);
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
        result = tradeMapper.getTradeDetail(no);
        return result;
    }

    public boolean removeTradeDetail(String no){
        int count = -1;
        count = tradeMapper.removeTradeDetail(no);
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
