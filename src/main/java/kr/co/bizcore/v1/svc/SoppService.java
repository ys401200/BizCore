package kr.co.bizcore.v1.svc;

import java.time.LocalDate;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import org.slf4j.LoggerFactory;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;
import kr.co.bizcore.v1.domain.Estimate;
import kr.co.bizcore.v1.domain.EstimateItem;
import kr.co.bizcore.v1.domain.Sales;
import kr.co.bizcore.v1.domain.Schedule;
import kr.co.bizcore.v1.domain.SimpleEstimate;
import kr.co.bizcore.v1.domain.SimpleSopp;
import kr.co.bizcore.v1.domain.Sopp;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class SoppService extends Svc {

    private static final Logger logger = LoggerFactory.getLogger(SoppService.class);
    
    public List<Sales> getSoppList(Sopp sopp){
        return soppMapper.getSoppList(sopp);
    }
    
    public String getSopp(int soppNo, String compId, String aesKey, String aesIv){
        Sopp result = null;
        String trade = null, estm = null, estmNo = null;
        List<HashMap<String, String>> attached = systemMapper.getAttachedFileList(compId, "sopp", soppNo);
        List<Schedule> list1 = scheduleMapper.getScheduleListFromSchedWithSopp(compId, soppNo+"");
        List<Schedule> list2 = scheduleMapper.getScheduleListFromSalesWithSopp(compId, soppNo+"");
        List<Schedule> list3 = scheduleMapper.getScheduleListFromTechdWithsopp(compId, soppNo+"");
        List<HashMap<String, String>> list = null;
        HashMap<String, String> each = null;
        JSONObject json = null;
        JSONArray jarr = null;
        int x = 0, y = 0, total = 0, v = 0, z1 = 0, z2 = 0;

        list1.addAll(list2);
        list1.addAll(list3);
        Collections.sort(list1);
        result = soppMapper.getSopp(soppNo + "", compId);

        // 매입매출 자료 가져오기 및 변환
        list = tradeMapper.getTradeByFunc(compId, "sopp:"+soppNo);
        trade = "[";
        if(list != null && list.size() > 0)    for(x = 0 ; x < list.size() ; x++){
            each = list.get(x);
            if(x > 0)   trade += ",";
            trade += ("{\"no\":" + each.get("no") + ",");
            trade += ("\"dt\":" + each.get("dt") + ",");
            trade += ("\"writer\":" + each.get("writer") + ",");
            trade += ("\"type\":" + (each.get("type") == null ? null : "\"" + each.get("type") + "\"") + ",");
            trade += ("\"product\":" + each.get("product") + ",");
            trade += ("\"customer\":" + each.get("customer") + ",");
            trade += ("\"taxbill\":" + (each.get("taxbill") == null ? null : "\"" + each.get("taxbill") + "\"") + ",");
            trade += ("\"title\":" + (each.get("title") == null ? null : "\"" + each.get("title") + "\"") + ",");
            trade += ("\"qty\":" + each.get("qty") + ",");
            trade += ("\"price\":" + each.get("price") + ",");
            trade += ("\"vat\":" + each.get("vat") + ",");
            trade += ("\"remark\":" + (each.get("remark") == null ? null : "\"" + each.get("remark") + "\"") + ",");
            trade += ("\"created\":" + each.get("created") + "}");

        }
        trade += "]";

        // 견적 가져오기 및 변환
        list = estimateMapper.getEstimateWithParent(compId, "sopp:" + soppNo);
        estm = "[";
        estmNo = "";
        if(list != null && 0 < list.size()){
            for(x = 0 ; x < list.size() ; x++){
                each = list.get(x);
                if(!estmNo.equals(each.get("no"))){
                    estmNo = each.get("no");
                    if(x > 0){
                        estm += "\"version\":" + v + ",";
                        estm += "\"total\":" + total + "},";
                        total = 0;
                        v = 0;
                    }
                    estm += ("{\"no\":\"" + estmNo + "\",");
                    estm += ("\"date\":" + each.get("date") + ",");
                    estm += ("\"form\":\"" + each.get("form") + "\",");
                    estm += ("\"title\":\"" + each.get("title") + "\",");
                    estm += "\"children\":[";
                }else   estm += "},";
                estm += ("{\"date\":" + each.get("date") + ",");
                estm += ("\"doc\":\"" + encAes(each.get("doc"), aesKey, aesIv) + "\",");
                estm += ("\"exp\":\"" + each.get("exp") + "\",");
                estm += ("\"form\":\"" + each.get("form") + "\",");
                estm += ("\"height\":" + each.get("height") + ",");
                estm += ("\"width\":" + each.get("width") + ",");
                estm += ("\"no\":\"" + estmNo + "\",");
                estm += ("\"related\":" + each.get("related") + ",");
                estm += ("\"remarks\":\"" + each.get("remarks") + "\",");
                estm += ("\"title\":\"" + each.get("title") + "\",");
                estm += ("\"version\":" + each.get("version") + ",");
                estm += ("\"writer\":" + each.get("writer"));
                json = new JSONObject(each.get("related"));
                json = json.getJSONObject("estimate");
                jarr = json.isNull("items") ? null : json.getJSONArray("items");
                if(jarr != null){
                    for(y = 0 ; y < jarr.length() ; y++){
                        z2 = (jarr.getJSONObject(y).getInt("quantity") * jarr.getJSONObject(y).getInt("price"));
                    }
                }
                z1 = strToInt(each.get("version"));
                if(z1 > v){
                    v = z1;
                    total = z2;
                }    
            }
            estm += ("}]");
            estm += ",\"version\":" + v + ",";
            estm += "\"total\":" + total + "}";
        }
        estm += "]";        

        return result == null ? null : result.toJson(attached, list1, trade, estm);
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
