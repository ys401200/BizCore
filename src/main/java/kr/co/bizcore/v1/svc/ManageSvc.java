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

    public boolean updateEmployeeBasic(int employee, String compId, String xAddress, String xBirthday, String xCellPhone, String xEmail,
            String xHomePhone, String xName, String xPw, String xRank, String xResidentNo, int xGender, int xZipCode,
            int xProhibited, String xResigned) {
        boolean result = true;
        String sql1 = null, sql2 = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        int r = -1;
        sql2 = " WHERE deleted IS NULL AND compId = '" + compId + "' AND no = " + employee;

        if(xAddress != null){
            if(sql1 != null)    sql1 += ",";
            else                sql1 = "";
            sql1 += (" address='" + xAddress + "'");
        }
        
        if(xBirthday != null){
            if(sql1 != null)    sql1 += ",";
            else                sql1 = "";
            sql1 += (" birthday='" + xBirthday + "'");
        }

        if(xCellPhone != null){
            if(sql1 != null)    sql1 += ",";
            else                sql1 = "";
            sql1 += (" cellphone='" + xCellPhone + "'");
        }

        if(xEmail != null){
            if(sql1 != null)    sql1 += ",";
            else                sql1 = "";
            sql1 += (" email='" + xEmail + "'");
        }

        if(xHomePhone != null){
            if(sql1 != null)    sql1 += ",";
            else                sql1 = "";
            sql1 += (" homephone='" + xHomePhone + "'");
        }

        if(xName != null){
            if(sql1 != null)    sql1 += ",";
            else                sql1 = "";
            sql1 += (" name='" + xName + "'");
        }

        if(xPw != null){
            if(sql1 != null)    sql1 += ",";
            else                sql1 = "";
            sql1 += (" pw='" + encSHA512(xPw) + "'");
        }

        if(xRank != null){
            if(sql1 != null)    sql1 += ",";
            else                sql1 = "";
            sql1 += (" rank=" + xRank + "");
        }

        if(xResidentNo != null){
            if(sql1 != null)    sql1 += ",";
            else                sql1 = "";
            sql1 += (" residentno='" + xResidentNo + "'");
        }

        if(xGender > -1){
            if(sql1 != null)    sql1 += ",";
            else                sql1 = "";
            sql1 += (" gender=" + xGender);
        }

        if(xZipCode > -1){
            if(sql1 != null)    sql1 += ",";
            else                sql1 = "";
            sql1 += (" zipcode=" + xZipCode);
        }

        if(xProhibited > -1){
            if(sql1 != null)    sql1 += ",";
            else                sql1 = "";
            sql1 += (" prohibited=" + xProhibited);
        }

        if(xResigned != null){
            if(sql1 != null)    sql1 += ",";
            else                sql1 = "";
            sql1 += (" resigned='" + xResigned + "'");
        }

        if(sql1 == null)    return false;
        
        sql1 += ", modified=NOW()";

        sql1 = "UPDATE bizcore.users SET " + sql1 + sql2;

        try{
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql1);
            r = pstmt.executeUpdate();
            result = r > 0;
        }catch(SQLException e){e.printStackTrace();}        
        
        return result;
    } // End of updateEmployeeBasic()

    public int updateEmployeePermission(String compId, String userNo, int employee, String dept, int xManager, int xAccounting,
            int xDoc, int xDocmng, int xHr, int xHead) {
        int result = -1;
        String sql = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        HashMap<String, Integer> perms = null;
        int x = 0, y = 0;

        try{
            conn = sqlSession.getConnection();

            // ========== 부서권한부터 처리
            perms = new HashMap<>();
            perms.put("head", -1);
            perms.put("doc", -1);
            sql = "SELECT func_id func, permission perm FROM bizcore.permission WHERE sub_id = 'A' AND func_id IN ('doc', 'head') AND comp_id = ? AND dept = ? AND user_no = ?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, compId);
            pstmt.setString(2, dept);
            pstmt.setInt(3, employee);
            rs = pstmt.executeQuery();
            while(rs.next())    perms.put(rs.getString(1), rs.getInt(2));
            rs.close();
            pstmt.close();

            x = perms.get("head");
            if(xHead != x){ // 요청된 값과 저장된 값이 달라야 변경할 필요가 있음
                if(xHead == 0){ // 권한을 제거하는 경우
                    sql = "DELETE FROM bizcore.permission WHERE sub_id = 'A' AND func_id = 'head' AND comp_id = ? AND dept = ? AND user_no = ?";
                    pstmt = conn.prepareStatement(sql);
                    pstmt.setString(1, compId);
                    pstmt.setString(2, dept);
                    pstmt.setInt(3, employee);
                    y += pstmt.executeUpdate();
                    pstmt.close();
                }else{ // 권한을 설정하는 경우
                    sql = "INSERT INTO bizcore.permission(comp_id, dept, user_no, func_id, sub_id, permission) values(?, ?, ?, 'head', 'A', 1)";
                    pstmt = conn.prepareStatement(sql);
                    pstmt.setString(1, compId);
                    pstmt.setString(2, dept);
                    pstmt.setInt(3, employee);
                    y += pstmt.executeUpdate();
                    pstmt.close();
                }
            }

            x = perms.get("doc");
            if(xDoc != x){ // 요청된 값과 저장된 값이 달라야 변경할 필요가 있음
                if(xDoc == 0){ // 권한을 제거하는 경우
                    sql = "DELETE FROM bizcore.permission WHERE sub_id = 'A' AND func_id = 'doc' AND comp_id = ? AND dept = ? AND user_no = ?";
                    pstmt = conn.prepareStatement(sql);
                    pstmt.setString(1, compId);
                    pstmt.setString(2, dept);
                    pstmt.setInt(3, employee);
                    y += pstmt.executeUpdate();
                    pstmt.close();
                }else{ // 권한을 설정하는 경우
                    sql = "INSERT INTO bizcore.permission(comp_id, dept, user_no, func_id, sub_id, permission) values(?, ?, ?, 'doc', 'A', 1)";
                    pstmt = conn.prepareStatement(sql);
                    pstmt.setString(1, compId);
                    pstmt.setString(2, dept);
                    pstmt.setInt(3, employee);
                    y += pstmt.executeUpdate();
                    pstmt.close();
                }
            }

            // ========== 전사권한 처리
            perms = new HashMap<>();
            perms.put("manager", -1);
            perms.put("hr", -1);
            perms.put("accounting", -1);
            perms.put("docmng", -1);
            sql = "SELECT func_id func, permission perm FROM bizcore.permission WHERE sub_id = 'A' AND dept = 'all' AND comp_id = ? AND user_no = ?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, compId);
            pstmt.setInt(2, employee);
            rs = pstmt.executeQuery();
            while(rs.next())    perms.put(rs.getString(1), rs.getInt(2));
            rs.close();
            pstmt.close();

            x = perms.get("hr");
            if(xHr != x){ // 요청된 값과 저장된 값이 달라야 변경할 필요가 있음
                if(xHr == 0){ // 권한을 제거하는 경우
                    sql = "DELETE FROM bizcore.permission WHERE sub_id = 'A' AND func_id = 'hr' AND dept = 'all' AND comp_id = ? AND user_no = ?";
                    pstmt = conn.prepareStatement(sql);
                    pstmt.setString(1, compId);
                    pstmt.setInt(2, employee);
                    y += pstmt.executeUpdate();
                    pstmt.close();
                }else{ // 권한을 설정하는 경우
                    sql = "INSERT INTO bizcore.permission(comp_id, dept, user_no, func_id, sub_id, permission) values(?, 'all', ?, 'hr', 'A', 1)";
                    pstmt = conn.prepareStatement(sql);
                    pstmt.setString(1, compId);
                    pstmt.setInt(2, employee);
                    y += pstmt.executeUpdate();
                    pstmt.close();
                }
            }

            x = perms.get("docmng");
            if(xDocmng != x){ // 요청된 값과 저장된 값이 달라야 변경할 필요가 있음
                if(xDocmng == 0){ // 권한을 제거하는 경우
                    sql = "DELETE FROM bizcore.permission WHERE sub_id = 'A' AND func_id = 'docmng' AND dept = 'all' AND comp_id = ? AND user_no = ?";
                    pstmt = conn.prepareStatement(sql);
                    pstmt.setString(1, compId);
                    pstmt.setInt(2, employee);
                    y += pstmt.executeUpdate();
                    pstmt.close();
                }else{ // 권한을 설정하는 경우
                    sql = "INSERT INTO bizcore.permission(comp_id, dept, user_no, func_id, sub_id, permission) values(?, 'all', ?, 'docmng', 'A', 1)";
                    pstmt = conn.prepareStatement(sql);
                    pstmt.setString(1, compId);
                    pstmt.setInt(2, employee);
                    y += pstmt.executeUpdate();
                    pstmt.close();
                }
            }

            x = perms.get("accounting");
            if(xAccounting != x){ // 요청된 값과 저장된 값이 달라야 변경할 필요가 있음
                if(xAccounting == 0){ // 권한을 제거하는 경우
                    sql = "DELETE FROM bizcore.permission WHERE sub_id = 'A' AND func_id = 'accounting' AND dept = 'all' AND comp_id = ? AND user_no = ?";
                    pstmt = conn.prepareStatement(sql);
                    pstmt.setString(1, compId);
                    pstmt.setInt(2, employee);
                    y += pstmt.executeUpdate();
                    pstmt.close();
                }else{ // 권한을 설정하는 경우
                    sql = "INSERT INTO bizcore.permission(comp_id, dept, user_no, func_id, sub_id, permission) values(?, 'all', ?, 'accounting', 'A', 1)";
                    pstmt = conn.prepareStatement(sql);
                    pstmt.setString(1, compId);
                    pstmt.setInt(2, employee);
                    y += pstmt.executeUpdate();
                    pstmt.close();
                }
            }

            x = perms.get("manager");
            if(xManager != x){ // 요청된 값과 저장된 값이 달라야 변경할 필요가 있음
                if(xManager == 0){ // 권한을 제거하는 경우
                    sql = "DELETE FROM bizcore.permission WHERE sub_id = 'A' AND func_id = 'manager' AND dept = 'all' AND comp_id = ? AND user_no = ?";
                    pstmt = conn.prepareStatement(sql);
                    pstmt.setString(1, compId);
                    pstmt.setInt(2, employee);
                    y += pstmt.executeUpdate();
                    pstmt.close();
                }else{ // 권한을 설정하는 경우
                    sql = "INSERT INTO bizcore.permission(comp_id, dept, user_no, func_id, sub_id, permission) values(?, 'all', ?, 'manager', 'A', 1)";
                    pstmt = conn.prepareStatement(sql);
                    pstmt.setString(1, compId);
                    pstmt.setInt(2, employee);
                    y += pstmt.executeUpdate();
                    pstmt.close();
                }
            }

        }catch(SQLException e){e.printStackTrace();}

        result = y;

        return result;
    } // End of updateEmployeePermission()

    public int updateEmployeeAsset(String compId, String userNo, int employee, ArrayList<String> xCard, String xVehicle,
            String xHipass) {
        int result = 0;
        String sql = null, t = null;
        String[] sa = new String[0];
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        ArrayList<String> remove = new ArrayList<>(), owned = new ArrayList<>();
        int x = -1, y = -1;
        boolean b = false;

        // 하이패스 카드는 법인카드에 통합하여 처리
        xCard.add(xHipass);

        try{
            conn = sqlSession.getConnection();

            // ================ 법인 차량에 대한 처리
            if(xVehicle != null){ // 요청된 차량이 타인에게 기 지급된 차량이면 회수처리함
                x = -1;
                sql = "SELECT employee FROM bizcore.corporate_vehicle_history WHERE retrieved IS NULL AND compId = ? AND employee <> ? AND vehicle = ?";
                pstmt = conn.prepareStatement(sql);
                pstmt.setString(1, compId);
                pstmt.setInt(2, employee);
                pstmt.setString(3, xVehicle);
                rs = pstmt.executeQuery();
                if(rs.next())   x = rs.getInt(1);
                rs.close();
                pstmt.close();
                if(x > 0){
                    sql = "UPDATE bizcore.corporate_vehicle_history SET retrieved = now() WHERE retrieved IS NULL AND compId = ? AND employee = ? AND vehicle = ?";
                    pstmt = conn.prepareStatement(sql);
                    pstmt.setString(1, compId);
                    pstmt.setInt(2, x);
                    pstmt.setString(3, xVehicle);
                    result += pstmt.executeUpdate();
                    pstmt.close();
                }
            }

            // 현재 할당된 차량이 있으면 그 번호를 가지고 옴
            sql = "SELECT vehicle FROM bizcore.corporate_vehicle_history WHERE retrieved IS NULL AND compId = ? AND employee = ?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, compId);
            pstmt.setString(2, userNo);
            rs = pstmt.executeQuery();
            if(rs.next())    t = rs.getString(1);
            rs.close();
            pstmt.close();

            if(xVehicle == null){ // 요청된 차량이 없는 경우
                if(t != null){ // 기 지급된 차량이 있는 경우
                    sql = "UPDATE bizcore.corporate_vehicle_history SET retrieved = now() WHERE retrieved IS NULL AND compId = ? AND employee = ? AND vehicle = ?";
                    pstmt = conn.prepareStatement(sql);
                    pstmt.setString(1, compId);
                    pstmt.setInt(2, employee);
                    pstmt.setString(3, t);
                    result += pstmt.executeUpdate();
                    pstmt.close();
                }
            }else{ // 요청된 차량이 있는 경우
                if(t != null && !xVehicle.equals(t)){ // 기 지급된 차량이 있는 경우
                    sql = "UPDATE bizcore.corporate_vehicle_history SET retrieved = now() WHERE retrieved IS NULL AND compId = ? AND employee = ? AND vehicle = ?";
                    pstmt = conn.prepareStatement(sql);
                    pstmt.setString(1, compId);
                    pstmt.setInt(2, employee);
                    pstmt.setString(3, t);
                    result += pstmt.executeUpdate();
                    pstmt.close();
                }
                sql = "INSERT INTO bizcore.corporate_vehicle_history(compId, employee, vehicle, issued, created) VALUES(?, ?, ?, now(), now())";
                pstmt.setString(1, compId);
                pstmt.setInt(2, employee);
                pstmt.setString(3, xVehicle);
                result += pstmt.executeUpdate();
                pstmt.close();
            }

            // ============= 법인카드에 대한 처리
            // 현재 보유중인 법인카드 목록을 가지고 옮
            sql =  "SELECT card FROM bizcore.corporate_card_history WHERE retrieved IS NULL AND compId = ? AND employee = ?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, compId);
            pstmt.setInt(2, employee);
            rs = pstmt.executeQuery();
            while(rs.next())    owned.add(rs.getString(1));
            rs.close();
            pstmt.close();

            if(xCard.size() == 0 && owned.size() > 0)  remove = owned;
            else if(xCard.size() > 0 && owned.size() > 0){
                xCard.toArray(sa);
                for(x = 0 ; x < owned.size() ; x++){
                    b = false;
                    for(y = 0 ; y < sa.length ; y++){
                        if(owned.get(x).equals(sa[y])){
                            b = true;
                            xCard.remove(sa[y]);
                            break;
                        }
                    }
                    if(!b)  remove.add(owned.get(x));
                }
            }

            // 회수처리할 카드가 있는 경우 이를 처리함
            t = null;
            if(remove.size() > 0){
                for(x = 0 ; x < remove.size() ; x++){
                    if(t == null)   t = "";
                    else            t += ",";
                    t += ("'" + remove.get(x) + "'");
                }
                sql = "UPDATE bizcore.corporate_card_history SET retrieved = now() WHERE retrieved IS NULL AND compId = '" + compId + "' AND employee = " + employee + " AND card IN (" + t + ")";
                pstmt = conn.prepareStatement(sql);
                result += pstmt.executeUpdate();
                pstmt.close();
            }

            // 신규 지급된 카드들에 대해 처리함
            sql = "INSERT INTO bizcore.corporate_card_history(compId, employee, card, issued, created) VALUES(?, ?, ?, now(), now())";
            for(x = 0 ; x < xCard.size() ; x++){
                pstmt = conn.prepareStatement(sql);
                pstmt.setString(1, compId);
                pstmt.setInt(2, employee);
                pstmt.setString(3, xCard.get(x));
                result += pstmt.executeUpdate();
                pstmt.close();
            }

        }catch(SQLException e){e.printStackTrace();}

        return result;
    } // End of updateEmployeeAsset()

    public String getDeptDetilInfo(String compId, String dept){
        String result = null;
        HashMap<String, String> each = null;
        each = deptMapper.getDeptDetailInfo(compId, dept);
        result = "{\"id\":\"" + each.get("deptId") + "\",";
        result += ("\"name\":\"" + each.get("deptName") + "\",");
        result += ("\"parent\":\"" + each.get("parent") + "\",");
        result += ("\"color\":\"" + each.get("colorCode") + "\",");
        result += ("\"isRoot\":" + each.get("isRoot").equals("1") + ",");
        result += ("\"head\":" + each.get("head") + ",");
        result += ("\"doc\":" + each.get("doc") + ",");
        result += ("\"created\":" + each.get("created") + ",");
        result += ("\"modified\":" + each.get("created") + ",");
        result += ("\"deleted\":" + each.get("deleted") + "}");logger.error("///////////////////////////////////////// " + result);
        return result;
    } // End of getEdptDetilInfo()
    
} 
