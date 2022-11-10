package kr.co.bizcore.v1.svc;

import java.io.UnsupportedEncodingException;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Base64;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class EstimateSvc extends Svc{

    private static final Logger logger = LoggerFactory.getLogger(EstimateSvc.class);

    // 견적 양식
    public String getEstimateBasic(String compId, String aesKey, String aesIv){
        String result = null, t = null, form = null, info = null;
        List<HashMap<String, String>> list = null;
        HashMap<String, String> each = null;
        int x = 0;

        // 견적 양식
        list = estimateMapper.getEstimateFormList(compId);
        form = "[";
        if(list != null && list.size() > 0) for(x = 0 ; x < list.size() ; x++){
            each = list.get(x);
            t = "{\"no\":" + each.get("no") + ",";
            t += ("\"name\":\"" + each.get("name") + "\",");
            t += ("\"version\":" + each.get("version") + ",");
            t += ("\"width\":" + each.get("width") + ",");
            t += ("\"height\":" + each.get("height") + ",");
            t += ("\"form\":\"" + encAes(each.get("form").replaceAll("\r", "").replaceAll("\n", "").replaceAll("\t", ""), aesKey, aesIv) + "\",");
            t += ("\"remark\":\"" + each.get("remark") + "\"}");
            if(x > 0)   form += ",";
            form += t;
        }
        form += "]";

        // 견적 기본정보
        list = estimateMapper.getEstmBasicInfo(compId);
        info = "{";
        if(list != null && list.size() > 0) for(x = 0 ; x < list.size() ; x++){
            each = list.get(x);
            t = ("\"" + each.get("no") + "\":");
            t += ("{\"name\":\"" + each.get("name") + "\",");
            t += ("\"firmName\":\"" + each.get("firmName") + "\",");
            t += ("\"representative\":\"" + each.get("representative") + "\",");
            t += ("\"address\":\"" + each.get("address") + "\",");
            t += ("\"phone\":\"" + each.get("phone") + "\",");
            t += ("\"fax\":\"" + each.get("fax") + "\"}");
            if(x > 0)   info += ",";
            info += t;
        }
        info += "}";

        result = "{\"form\":" + form + ",\"info\":" + info + "}";

        return result;
    } // End of getEstimateForms()

    // 견적에 들어갈 아이템 목록
    public String getItems(String compId){
        String result = null, t = null;
        List<HashMap<String, String>> list = null;
        HashMap<String, String> each = null;
        int x = 0;

        list = estimateMapper.getItems(compId);
        result = "[";
        if(list != null && list.size() > 0) for(x = 0 ; x < list.size() ; x++){
            each = list.get(x);
            t = "{\"no\":" + each.get("no") + ",";
            t += ("\"category\":\"" + each.get("category") + "\",");
            t += ("\"supplier\":" + each.get("supplier") + ",");
            t += ("\"product\":\"" + each.get("product") + "\",");
            t += ("\"desc\":\"" + each.get("desc") + "\",");
            t += ("\"price\":" + each.get("price") + "}");
            if(x > 0)   result += ",";
            result += t;
        }
        result += "]";
        return result;
    } // End of getEstimateForms()

    // 견적 목록
    public String getEstimateList(String compId){
        String result = null, t = null, related = null;
        List<HashMap<String, String>> list = null;
        HashMap<String, String> each = null;
        JSONObject json = null;
        JSONArray jarr = null;
        int x = 0, y = 0, total = 0;

        list = estimateMapper.getEstmList(compId);
        result = "[";
        if(list != null && list.size() > 0) for(x = 0 ; x < list.size() ; x++){
            each = list.get(x);
            related = estimateMapper.getLastEstmData(compId, each.get("no"));
            total = 0;
            json = new JSONObject(related);
            json = json.getJSONObject("estimate");
            jarr = json.isNull("items") ? null : json.getJSONArray("items");
            if(jarr != null && jarr.length() > 0)   for(y = 0 ; y < jarr.length() ; y++){
                json = jarr.getJSONObject(y);
                total += ((json.isNull("quantity") ? 0 : json.getInt("quantity")) * (json.isNull("price") ? 0 : json.getInt("price")));
            }
            t = "{\"no\":\"" + each.get("no") + "\",";
            t += ("\"form\":\"" + each.get("form") + "\",");
            t += ("\"title\":\"" + each.get("title") + "\",");
            t += ("\"version\":\"" + each.get("version") + "\",");
            t += ("\"date\":" + each.get("dt") + ",");
            t += ("\"total\":" + total + "}");
            if(x > 0)   result += ",";
            result += t;
        }
        result += "]";
        return result;
    } // End of getEstimateForms()

    // 견적 목록
    public String getEstmVersionList(String compId, String estmNo, String aesKey, String aesIv){
        String result = null, t = null, z = null;
        List<HashMap<String, String>> list = null;
        HashMap<String, String> each = null;
        JSONObject json = null;
        JSONArray jarr = null;
        int x = 0, y = 0, total = 0;

        list = estimateMapper.getEstmVersionList(compId, estmNo);
        result = "[";
        if(list != null && list.size() > 0) for(x = 0 ; x < list.size() ; x++){
            each = list.get(x);
            z = each.get("doc");
            z = encAes(z, aesKey, aesIv);
            total = 0;
            json = new JSONObject(each.get("related"));
            jarr = json.isNull("items") ? null : json.getJSONArray("items");
            if(jarr != null && jarr.length() > 0)   for(y = 0 ; y < jarr.length() ; y++){
                json = jarr.getJSONObject(y);
                total += ((json.isNull("quantity") ? 0 : json.getInt("quantity")) * (json.isNull("price") ? 0 : json.getInt("price")));
            }
            t = "{\"no\":\"" + each.get("no") + "\",";
            t += ("\"form\":\"" + each.get("form") + "\",");
            t += ("\"title\":\"" + each.get("title") + "\",");
            t += ("\"version\":\"" + each.get("version") + "\",");
            t += ("\"date\":" + each.get("dt") + ",");
            t += ("\"exp\":\"" + each.get("exp") + "\",");
            t += ("\"writer\":" + each.get("writer") + ",");
            t += ("\"doc\":\"" + z + "\",");
            t += ("\"width\":" + each.get("width") + ",");
            t += ("\"height\":" + each.get("height") + ",");
            t += ("\"remarks\":\"" + each.get("remarks") + "\",");
            t += ("\"related\":" + each.get("related") + ",");
            t += ("\"total\":" + total + "}");
            if(x > 0)   result += ",";
            result += t;
        }
        result += "]";
        return result;
    } // End of getEstimateForms()


    // 견적 저장
    public String saveEstimate(String compId, String userNo, JSONObject estm, String estmNo) {
        String result = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        JSONObject json = null;
        JSONArray jarr = null;
        Calendar cal = Calendar.getInstance();
        String sql = null;
        String xCip = null, xCustomer = null, xExp = null, xForm = null, xRemarks = null, xTitle = null, xDoc = null, xWidth = null, xHeight = null, xRelated = null;
        String zDiv = null, zItem = null, zPrice = null, zQuantity = null, zRemark = null, zSpec = null, zSupplier = null, zTitle = null;
        long xDate = -1;
        Date date = null;
        String[] item = null;
        String[][] items = null;
        int x = -1, y = -1, version = -1, r = 0;

        // JSON 데이터를 개별 변수 및 배열 변수에 먼저 저장하기
        xCip = estm.getString("cip");
        xCustomer = estm.getString("customer");
        xExp = estm.getString("exp");
        xForm = estm.getString("form");
        xRemarks = estm.getString("remarks");
        xTitle = estm.getString("title");
        xDate = estm.getLong("date");
        xDoc = estm.getString("doc");
        xWidth = estm.getInt("width") + "";
        xHeight = estm.getInt("height") + "";
        xRelated = estm.getJSONObject("related").toString();
        date = new Date(xDate);

        jarr = estm.getJSONArray("items");
        items = new String[jarr.length()][];
        for(x = 0 ; x < jarr.length() ; x++){
            json = jarr.getJSONObject(x);
            zDiv = json.getString("div");
            zItem = json.getString("item");
            zPrice = json.getInt("price") + "";
            zQuantity = json.getInt("quantity") + "";
            zRemark = json.getString("remark");
            zSpec = json.getString("spec");
            zSupplier = json.getString("supplier");
            zTitle = json.getString("title");
            item = new String[8];
            item[0] = zDiv;
            item[1] = zItem;
            item[2] = zPrice;
            item[3] = zQuantity;
            item[4] = zRemark;
            item[5] = zSpec;
            item[6] = zSupplier;
            item[7] = zTitle;
            items[x] = item;
        }
        
        // 견적 번호를 받아오고 견적 항목을 DB에 저장하도록 함
        try{
            conn = sqlSession.getConnection();
            
            // 견적번호 없는 경우 견적번호를 받아오고 있는 경우 최종 버전을 받아와서 하나 더하기
            if(estmNo == null){
                x = cal.get(Calendar.MONTH) + 1;
                estmNo = compId.toUpperCase() + (cal.get(Calendar.YEAR) + "" + (x < 10 ? "0" + x : x)) + "_";
                sql = "SELECT LPAD(IFNULL(MAX(SUBSTRING(estmNo,?)),0)+1, 4, '0') FROM bizcore.estimate WHERE compId = ? AND estmNo LIKE ?";
                pstmt = conn.prepareStatement(sql);
                pstmt.setInt(1, estmNo.length() + 1);
                pstmt.setString(2, compId);
                pstmt.setString(3, estmNo + "%");
                rs = pstmt.executeQuery();
                if(rs.next())   estmNo = estmNo + rs.getString(1);
                version = 1;
                rs.close();
                pstmt.close();
            }else{
                sql = "SELECT IFNULL(MAX(version),0) FROM bizcore.estimate WHERE compId = ? AND estmNo = ?";
                pstmt = conn.prepareStatement(sql);
                pstmt.setString(1, compId);
                pstmt.setString(2, estmNo);
                rs = pstmt.executeQuery();
                if(rs.next())   version = rs.getInt(1) + 1;
                rs.close();
                pstmt.close();
            }
            // 견적 기본정보 저장하기
            sql = "INSERT INTO bizcore.estimate(compId,estmNo,formName,title,version,dt,`exp`,writer,doc,width,height,remarks,related,created) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())";
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, compId);
            pstmt.setString(2, estmNo);
            pstmt.setString(3, xForm);
            pstmt.setString(4, xTitle);
            pstmt.setInt(5, version);
            pstmt.setDate(6, date);
            pstmt.setString(7, xExp);
            pstmt.setString(8, userNo);
            pstmt.setString(9, xDoc);
            pstmt.setString(10, xWidth);
            pstmt.setString(11, xHeight);
            pstmt.setString(12, xRemarks);
            pstmt.setString(13, xRelated);
            r += pstmt.executeUpdate();
            rs.close();
            pstmt.close();

            // 견적 항목정보 저장하기
            sql = "INSERT INTO bizcore.estimate_items(`div`,item,price,qty,remark,spec,supplier,title,compId,estmNo,version,created) VALUES(?,?,?,?,?,?,?,?,?,?,?,NOW())";
            for(x = 0 ; x < items.length ; x++){
                item = items[x];
                pstmt = conn.prepareStatement(sql);
                for(y = 0 ; y < item.length ; y++)  pstmt.setString(y+1, item[y]);
                pstmt.setString(9, compId);
                pstmt.setString(10, estmNo);
                pstmt.setInt(11, version);
                r += pstmt.executeUpdate();
                rs.close();
                pstmt.close();
            }

            result = "\"estmNo\":\"" + estmNo + "\",\"insert\":" + r;
            
        }catch(SQLException e){e.printStackTrace();}


        return result;
    } // End of saveEstimate()
    
}
