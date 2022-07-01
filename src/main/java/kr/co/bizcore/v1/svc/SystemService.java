package kr.co.bizcore.v1.svc;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

import kr.co.bizcore.v1.domain.ConnUrl;
import kr.co.bizcore.v1.domain.Permission;
import kr.co.bizcore.v1.domain.User;

@Service
public class SystemService extends Svc {

    public String test() {
        String result = systemMapper.test();
        return result;
    } // End of test()

    public String getConnUrl() {
        List<ConnUrl> data = null;
        String result = null;
        data = systemMapper.getConnUrl();

        for (ConnUrl each : data) {
            result = each.getConnAddr() + " / " + each.getCompId();
            System.out.println(result);
        }
        return result;
    } // End of getConnUrl()

    // 클라이언트가 접속한 서버 url을 입력받아서 compId를 반환하는 메서드
    public String findCompIdFromConnUrl(String server) {
        List<ConnUrl> urls = null;
        String result = null, t = null;
        ConnUrl each = null;
        int x = 0;

        urls = systemMapper.getConnUrl();
        if (urls != null && urls.size() > 0)
            for (x = 0; x < urls.size(); x++) {
                each = urls.get(x);
                t = each.getConnAddr();
                if (t.substring(0, 1).equals("*")) { // 첫 글자가 와인드카드인 경우
                    if (t.contains(server)) {
                        result = each.getCompId();
                        break;
                    }
                } else { // 와일드카드가 아닌 경우
                    if (t.equals(server)) {
                        result = each.getCompId();
                        break;
                    }
                }
            }

        return result;
    } // End oif findCompIdFromConnUrl()

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
        data = systemMapper.getUserPermission(user.getCompId(), user.getDeptId(), user.getUserNo());

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
