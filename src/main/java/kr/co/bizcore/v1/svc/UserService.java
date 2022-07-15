package kr.co.bizcore.v1.svc;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import kr.co.bizcore.v1.domain.SimpleUser;

@Service
public class UserService extends Svc {

    public SimpleUser getBasicUserInfo(String userNo, String compId) {
        SimpleUser result = userMapper.getBasicUserInfo(userNo, compId);
        return result;
    } // End of getBasicUserInfo

    // 로그인 검증 메서드
    public String verifyLogin(String compId, String userId, String pw) {
        String result = systemMapper.verifyLogin(compId, userId, pw);
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
}
