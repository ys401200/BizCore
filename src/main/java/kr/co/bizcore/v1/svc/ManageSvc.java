package kr.co.bizcore.v1.svc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Product;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ManageSvc extends Svc{
    
    private static final Logger logger = LoggerFactory.getLogger(ManageSvc.class);

    // 관리자용 - 직원 함녕의 전체 정보를 가져오는 메서드
    public String getEmployeeDetailInfo(String compId, int employee){
        String result = null, t = null, aesKey = null, aesIv = null;
        String id = null, name = null,rank = null,prohibited = null, birthDay = null, gender = null, residentNo = null, email = null ,address = null,zipCode = null,homePhone = null,cellPhone = null,joined = null,resigned = null,created = null,modified = null,deleted = null;
        HashMap<String, String> info = null;

        info = userMapper.getEmployeeDetailInfo(compId, employee);
        
        id = info.get("userId");
        name = info.get("userName");
        rank = info.get("rank");
        prohibited = info.get("prohibited");
        birthDay = info.get("birthDay");
        gender = info.get("gender");
        residentNo = info.get("residentNo");
        email = info.get("email");
        address = info.get("address");
        zipCode = info.get("zipCode");
        homePhone = info.get("homePhone");
        cellPhone = info.get("cellPhone");
        joined = info.get("joined");
        resigned = info.get("resigned");
        created = info.get("created");
        modified = info.get("modified");
        deleted = info.get("deleted");

        // 주민번호 복호화
        if(residentNo != null){
            info = systemMapper.getCompanyAesKey(compId);
            aesKey = info.get("aesKey");
            aesIv = info.get("aesIv");
            residentNo = decAes(residentNo, aesKey, aesIv);
        }

        result = ("{\"id\":\"" + id + "\",");
        result += ("\"no\":\"" + employee + "\",");
        result += ("\"name\":\"" + name + "\",");
        result += ("\"rank\":" + rank + ",");
        result += ("\"prohibited\":" + prohibited.equals("1") + ",");
        result += ("\"birthDay\":\"" + birthDay + "\",");
        result += ("\"gender\":" + gender + ",");
        result += ("\"residentNo\":" + residentNo + ",");
        result += ("\"email\":" + (email == null ? null : "\"" + email + "\"") + ",");
        result += ("\"address\":" + (address == null ? null : "\"" + address + "\"") + ",");
        result += ("\"zipCode\":" + zipCode + ",");
        result += ("\"homePhone\":" + (homePhone == null ? null : "\"" + homePhone + "\"") + ",");
        result += ("\"cellPhone\":" + (cellPhone == null ? null : "\"" + cellPhone + "\"") + ",");
        result += ("\"joined\":\"" + joined + "\",");
        result += ("\"resigned\":" + (resigned == null ? null : "\"" + resigned + "\"") + ",");
        result += ("\"created\":" + created + ",");
        result += ("\"modified\":" + modified + ",");
        result += ("\"deleted\":" + deleted + "}");

        return result;
    }

    public String getProductList(String compId){
        String result = null;
        List<Product> list = null;
        Product each = null;
        int x = 0;

        list = commonMapper.getProductList(compId);
        result = "[";
        for(x = 0 ; x < list.size() ; x++){
            if(x > 0)   result += ",";
            each = list.get(x);
            result += each.toJson();
        }
        result += "]";

        return result;
    }

    // 연차 사용정보
    public String[] getManagePermission(String compId, String userNo){
        String[] result = null;
        String sql = "SELECT sub_id AS sub FROM bizcore.permission WHERE dept = 'all' AND func_id  = 'manager' AND permission  > 0 AND comp_id = ? AND user_no = ?";
        ArrayList<String> arr = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        int x = 0;

        try{
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, compId);
            pstmt.setString(2, userNo);
            rs = pstmt.executeQuery();
            while(rs.next()){
                if(arr == null)  arr = new ArrayList<>();
                arr.add(rs.getString(1));
            }
        }catch(SQLException e){e.printStackTrace();}

        if(arr != null){
            result = new String[arr.size()];
            for(x = 0 ; x < arr.size() ; x++)   result[x] = arr.get(x);
        }

        return result;
    }

    public String getUsedAnnualLeave(String compId, int employee){
        String result = null;
        List<HashMap<String, String>> list = null;
        HashMap<String, String> each = null;
        int x = 0;

        list = commonMapper.getUsedAnnualLeave(compId, employee);
        result = "[";
        if(list != null)    for(x = 0 ; x < list.size() ; x++){
            each = list.get(x);
            if(x > 0)   result += ",";
            result += ("{\"start\":" + each.get("start") + ",");
            result += ("\"end\":" + each.get("end") + ",");
            result += ("\"used\":" + each.get("used") + "}");
        }
        result += "]";

        return result;
    }

    // 권한
    public String getPermissionWithDept(String compId, String dept, int employee){
        String result = null, n = null;
        List<HashMap<String, String>> list = null;
        HashMap<String, String> each = null, dpt = null, all = null;
        Object[] keyset = null;
        int x = 0;

        all = new HashMap<>();
        all.put("manager", "0");
        all.put("accounting", "0");
        all.put("hr", "0");
        all.put("docmng", "0");
        dpt = new HashMap<>();
        dpt.put("head", "0");
        dpt.put("doc", "0");

        list = commonMapper.getPermissionWithDept(compId, dept, employee);
        for(x = 0 ; x < list.size() ; x++){
            each = list.get(x);
            if(each.get("dept").equals("all"))  all.put(each.get("sub"), each.get("perm"));
            else    dpt.put(each.get("sub"), each.get("perm"));
        }

        result = "{";
        keyset = all.keySet().toArray();
        for(x = 0 ; x < keyset.length ; x++){
            n = (String)keyset[x];
            if(!result.equals("{")) result += ",";
            result += ("\"" + n + "\":" + all.get(n).equals("1"));
        }

        keyset = dpt.keySet().toArray();
        for(x = 0 ; x < keyset.length ; x++){
            n = (String)keyset[x];
            if(!result.equals("{")) result += ",";
            result += ("\"" + n + "\":" + dpt.get(n).equals("1"));
        }
        result += "}";

        return result;
    }

    // 법인카드 현황 및 사용자
    public String getCorporateCardList(String compId){
        String result = null;
        List<HashMap<String, String>> list = null;
        HashMap<String, String> each = null;
        int x = 0;

        list = commonMapper.getCorporateCardList(compId);
        result = "[";
        if(list != null)    for(x = 0 ; x < list.size() ; x++){
            each = list.get(x);
            if(x > 0)   result += ",";
            result += ("{\"card\":\"" + each.get("card") + "\",");
            result += ("\"div\":\"" + each.get("div") + "\",");
            result += ("\"bank\":\"" + each.get("bank") + "\",");
            result += ("\"hipass\":" + each.get("hipass").equals("1") + ",");
            result += ("\"employee\":" + each.get("employee") + "}");
        }
        result += "]";

        return result;
    }

    public String getCorporateVehicleList(String compId){
        String result = null;
        List<HashMap<String, String>> list = null;
        HashMap<String, String> each = null;
        int x = 0;

        list = commonMapper.getCorporateVehicleList(compId);
        result = "[";
        if(list != null)    for(x = 0 ; x < list.size() ; x++){
            each = list.get(x);
            if(x > 0)   result += ",";
            result += ("{\"vehicle\":\"" + each.get("vehicle") + "\",");
            result += ("\"model\":\"" + each.get("model") + "\",");
            result += ("\"employee\":" + each.get("employee") + "}");
        }
        result += "]";

        return result;
    }
    
}
