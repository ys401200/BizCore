package kr.co.bizcore.v1.svc;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Permission;
import kr.co.bizcore.v1.domain.User;

@Service
public class UserService extends Svc {

    public User getBasicUserInfo(String userNo) {
        User result = userMapper.getBasicUserInfo(userNo);
        return result;
    } // End of getBasicUserInfo

    // 로그인 검증 메서드
    public String verifyLogin(String compId, String userId, String pw) {
        String result = systemMapper.verifyLogin(compId, userId, pw);
        System.out.println("[TEST] ::::: Login Verifier / compId : " + compId + " / userId : " + userId + "pw : " + pw);
        System.out.println("[TEST] ::::: is logged in ? userNo! ::: " + result);
        return result;
    } // End of verifyLogin()

    // User 객체를 입력받고 권한을 설정하는 메서드
    public void setPermission(User user) {
        List<Map<String, String>> data = null;
        Map<String, String> each = null;
        String permission = null;
        Permission result = null;
        int x = 0, t = 0;

        if (user == null)
            return;

        System.out.println("[TEST] :::::::::: User" + user.toJson());
        data = userMapper.getUserPermission(user.getCompId(), user.getDeptId(), user.getUserNo() + "");

        if (data == null)
            return;

        result = new Permission();
        for (x = 0; x < data.size(); x++) {
            t = 0;
            each = data.get(x);
            permission = each.get("permission");
            if (permission != null)
                t = Integer.parseInt(permission);
            result.setSubPermission(each.get("funcId"), each.get("subId"), t);
        }
        user.setPermission(result);
    } // End of setPermission()

}
