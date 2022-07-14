package kr.co.bizcore.v1.svc;

import org.springframework.stereotype.Service;
import java.util.List;

import kr.co.bizcore.v1.domain.ConnUrl;

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

        urls = (List<ConnUrl>)dataFactory.getData("ALL", "connUrl");
        if(urls == null){
            urls = systemMapper.getConnUrl();
            dataFactory.setData("ALL", "connUrl", urls, 300);
            System.out.println("[TEST] :::::::::: ConnUrl Data is Reset.");
        }

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

}
