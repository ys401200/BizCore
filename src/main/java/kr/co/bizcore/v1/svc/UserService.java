package kr.co.bizcore.v1.svc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONObject;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import kr.co.bizcore.v1.domain.SimpleUser;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserService extends Svc {

    private static final org.slf4j.Logger logger = LoggerFactory.getLogger(UserService.class);
    public UserService(){super();}

    public SimpleUser getBasicUserInfo(String userNo, String compId) {
        SimpleUser result = userMapper.getBasicUserInfo(userNo, compId);
        return result;
    } // End of getBasicUserInfo

    // 로그인 검증 메서드 / 이사하기 전
    public String verifyLogin(String compId, String userId, String pw) {
        String result = systemMapper.verifyLogin(compId, userId, pw);
        return result;
    } // End of verifyLogin()

    // 로그인 검증 메서드 / 이사하는 과도기에 사용하는 메서드 / 비번 유혐 감지 후 기존비번인 경우 신규 비번으로 바꾸도록 함
    public String[] verifyLoginTemp(String compId, String userId, String pw, boolean keep) {
        String[] result = new String[5], t = null;
        String userNo = null, pwDB = null, pwCvt = null, keepToken = null, userName, userRank;
        String sql1 = "SELECT no AS userNo, pw, PASSWORD(?), prohibited FROM bizcore.users WHERE userid = ? AND compId = ? AND deleted IS NULL";
               sql1 = "SELECT no AS userNo, pw, PASSWORD(?), username, (SELECT namekor FROM bizcore.user_rank WHERE compId = ? AND level = rank) AS rank FROM bizcore.users a WHERE userid = ? AND compId = ? AND deleted IS NULL";
        String sql2 = "UPDATE bizcore.users SET pw = ? WHERE compId = ? AND no = ?";
        boolean prohibited = false;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try{
            conn = sqlSession.getConnection();

            // 비번유형에 대한 파악
            pstmt = conn.prepareStatement(sql1);
            pstmt.setString(1, pw);
            pstmt.setString(2, compId);
            pstmt.setString(3, userId);
            pstmt.setString(4, compId);
            rs = pstmt.executeQuery();
            if(!rs.next())  return result; // 결과가 없으면 종료함 / 로그인 x
            userNo = rs.getString(1);
            pwDB = rs.getString(2);
            pwCvt = rs.getString(3);
            userName = rs.getString(4);
            userRank = rs.getString(5);
            prohibited = rs.getBoolean(6);
            rs.close();
            pstmt.close();

            if(pwDB.substring(0,1).equals("*")){ // 기존 비번 모드
                if(!pwDB.equals(pwCvt)) return result; // 패스워드 불일치시 종료함 / 로그인 x
                result[0] = userNo;
                result[2] = userName;
                result[3] = userRank;
                result[4] = prohibited ? "prohibited" : null;

                pstmt = conn.prepareStatement(sql2);
                pstmt.setString(1, encSHA512(pw));
                pstmt.setString(2, compId);
                pstmt.setString(3, userNo);
                pstmt.executeUpdate();
            }else{ // 신규 비번 모드
                pwCvt = encSHA512(pw);
                if(pwDB.equals(pwCvt)){
                    result[0] = userNo;
                    result[2] = userName;
                    result[3] = userRank;
                    result[4] = prohibited ? "prohibited" : null;
                }
            }
            
        }catch(SQLException e){e.printStackTrace();}

        // 로그인 유지 상태 처리
        if(keep && result[0] != null){
            t = getCompanyAesKey(compId); // 회사의 암호키를 받아옴
            keepToken = generateKey(128); // 토큰 생성
            systemMapper.deleteKeepTokenByUser(compId, result[0]); // 혹시 있을지 모르는 토큰을 삭제함
            systemMapper.setKeepToken(compId, keepToken, result[0], System.currentTimeMillis() + 86400000);
            keepToken = encAes(keepToken, t[0], t[1]);
            result[1] = compId + "=" + keepToken;
        }else if(!keep && result[0] != null){
            systemMapper.deleteKeepTokenByUser(compId, result[0]);
        }

        return result;
    } // End of verifyLogin()

    // 사번기준 사용자 정보가 있는 객체를 전달하는 메서드
    public HashMap<String, SimpleUser> getUserMap(String compId){
        HashMap<String, SimpleUser> userMap = null;
        List<SimpleUser> userList = null;
        List<Map<String, String>> deptInfo = null, permList = null;
        Map<String, String> deptEach = null, permEach = null;
        SimpleUser each = null;
        String userNo = null, deptId = null, funcId = null, subId, perm = null;
        int x = 0;

        userMap = (HashMap<String, SimpleUser>)dataFactory.getData(compId, "userMap");
        if(userMap == null){
            userList = userMapper.getAllUser(compId);
            deptInfo = userMapper.getAllDeptInfo(compId);
            permList = userMapper.getAllPermission(compId);
            if(userList != null && userList.size() > 0){
                userMap = new HashMap<>();
                
                // user 정보가 담긴 list를 map으로 변환
                for(x = 0 ; x < userList.size() ; x++){
                    each = userList.get(x);
                    userMap.put(each.getUserNo()+"", each);
                }

                // 변환된 map에 각 사용자의 부서를 설정
                for(x = 0 ; x < deptInfo.size() ; x++){
                    deptEach = deptInfo.get(x);
                    userNo = deptEach.get("userNo");
                    deptId = deptEach.get("deptId");
                    each = userMap.get(userNo);
                    if(each != null){
                        each.addDeptId(deptId);
                    }
                }

                // 각 사용자의 권한을 설정
                for(x = 0 ; x < permList.size() ; x++){
                    permEach = permList.get(x);
                    userNo = permEach.get("userNo");
                    each = userMap.get(userNo);
                    if(each != null){
                        each.setPermission(permEach.get("deptId"), permEach.get("funcId"), permEach.get("subId"), permEach.get("permission"));
                    }
                }

                // factory에 저장
                dataFactory.setData(compId, "userMap", userMap, 300);
            }
        }
        return userMap;
    } // End of getUserMap()

    // 직급정보를 전달하는 메서드
    public String getUserRank(String compId){
        HashMap<String, String> each = null;
        List<HashMap<String, String>> list = null;
        String result = null;
        int x = 0;

        result = (String)dataFactory.getData(compId, "userRank");
        if(result == null){
            list = userMapper.getUserRank(compId);
            result = "{";
            for(x = 0 ; x < list.size() ; x++){
                if(x > 0)   result += ",";
                each = list.get(x);
                result += ("\"" + each.get("lv") + "\":");
                result += ("[\"" + each.get("nameKor") + "\",\"" + each.get("nameEng") + "\"]");
            }
            result += "}";
            // factory에 저장
            dataFactory.setData(compId, "userRank", result, 300);
            
        }
        return result;
    } // End of getUserMap()

    public String getUserMapJson(String compId){
        String result = "{";
        HashMap<String, SimpleUser> map = null;
        SimpleUser user = null;
        Object[] keySet = null;
        String userNo = null;
        int x = 0;

        map = getUserMap(compId);
        keySet = map.keySet().toArray();
        for(x = 0 ; x < keySet.length ; x++){
            userNo = (String)keySet[x];
            user = map.get(userNo);
            if(x > 0)    result += ",";
            result += "\"" + userNo + "\":";
            result += user.toJson();
        }
        result += "}";
        return result;
    } // End of getUserMapJson()

    // 개인화 정보를 가져오는 메서드
    public String getPersonalize(String compId, String userNo) {
        String result = null;
        result = userMapper.getPersonalize(compId, userNo);
        if(result == null)  result = "{}";
        return null;
    }

    // 개인화 정보를 저장하는 메서드
    public int setPersonalize(String compId, String userNo, String data) {
        int result = -9999;
        result = userMapper.modifyPersonalize(compId, userNo, data);
        return result;
    }
}
