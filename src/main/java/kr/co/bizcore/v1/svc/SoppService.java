package kr.co.bizcore.v1.svc;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Estimate;
import kr.co.bizcore.v1.domain.EstimateItem;
import kr.co.bizcore.v1.domain.Schedule;
import kr.co.bizcore.v1.domain.SimpleEstimate;
import kr.co.bizcore.v1.domain.SimpleSopp;
import kr.co.bizcore.v1.domain.Sopp;
import kr.co.bizcore.v1.domain.TradeDetail;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class SoppService extends Svc {

    private static final Logger logger = LoggerFactory.getLogger(SoppService.class);
    
    public String getSoppList(String compId){
        String result = null;
        List<SimpleSopp> list = null;
        int x = 0;

        list = soppMapper.getSoppList(compId);
        if(list != null && list.size() > 0){
            for(x = 0 ; x < list.size() ; x++){
                if(x == 0)  result = "[";
                else        result += ",";
                result += list.get(x).toJson();
            }
            result += "]";
        }

        return result;
    } // End of getSoppList()
    
    public String getSopp(int soppNo, String compId){
        Sopp result = null;
        List<HashMap<String, String>> attached = systemMapper.getAttachedFileList(compId, "sopp", soppNo);
        List<Schedule> list1 = scheduleMapper.getScheduleListFromSchedWithSopp(compId, soppNo+"");
        List<Schedule> list2 = scheduleMapper.getScheduleListFromSalesWithSopp(compId, soppNo+"");
        List<Schedule> list3 = scheduleMapper.getScheduleListFromTechdWithsopp(compId, soppNo+"");
        List<TradeDetail> list4 = tradeMapper.getTradeDetailList(soppNo+"");
        list1.addAll(list2);
        list1.addAll(list3);
        Collections.sort(list1);
        result = soppMapper.getSopp(soppNo+"", compId);
        return result.toJson(attached, list1, list4);
    }

    public String getEstimateList(String compId){
        String result = null;
        List<SimpleEstimate> list = null;
        int x = 0;

        list = soppMapper.getEstimateList(compId);
        if(list != null){
            result = "[";
            for(x = 0 ; x < list.size() ; x++){
                if(x > 0)   result += ",";
                result += list.get(x).toJson();
            }
            result += "]";
        }

        return result;
    } // End of getEstimateList()

    public Estimate getEstimate(String no, String compId){
        Estimate result = null;
        HashMap<String, String> info = null;
        List<EstimateItem> items = null;
        int x = 0;

        result = soppMapper.getEstimate(no, compId);
        if(result != null){
            info = soppMapper.getEstimateInfo(result.getId(), result.getVer());
            if(info != null){
                result.setCompany(info.get("company"));
                result.setCeo(info.get("ceo"));
                result.setAddress(info.get("address"));
                result.setPhone(info.get("phone"));
                result.setFax(info.get("fax"));
                result.setPeriod(strToInt(info.get("period")));
                result.setContent(info.get("content"));
            }
            items = soppMapper.getEstimateItems(result.getId(), result.getVer());
            if(items != null)   for(x = 0 ; x < items.size() ; x++) result.addItem(items.get(x));
        }

        return result;
    } // End of getEstimate()

    public boolean addSopp(Sopp sopp, String compId){
        int x = -1;
        String sql = null;
        sql = sopp.createInsertQuery(null, compId);
        x = executeSqlQuery(sql);
        return x > 0;
    }

    public boolean modifySopp(String no, Sopp sopp, String compId){
        int x = -1;
        Sopp ogn = null;
        String sql = null;
        ogn = soppMapper.getSopp(no, compId);
        sql = ogn.createUpdateQuery(sopp, null);
        sql = sql + " WHERE soppno = " + no + " AND compno = (SELECT compno FROM swc_company WHERE compid = '" + compId + "')";
        x = executeSqlQuery(sql);
        return x > 0;
    }

    public boolean removeSopp(String no, String compId){
        int x = -1;
        x = soppMapper.removeSopp(no, compId);
        return x > 0;
    }

}
