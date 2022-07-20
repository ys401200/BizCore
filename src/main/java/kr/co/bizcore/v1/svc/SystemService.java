package kr.co.bizcore.v1.svc;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

import kr.co.bizcore.v1.domain.ConnUrl;
import kr.co.bizcore.v1.domain.SimpleCustomer;
import kr.co.bizcore.v1.domain.SimpleUser;

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

    // 고객사 정보를 전달하는 메서드
    public String getCustomers(String compId){
        String result = null;
        SimpleCustomer each = null;
        List<SimpleCustomer> list = null;
        int x = 0;

        list = commonMapper.getCustomerList(compId);

        if(list != null && list.size() > 0){
            if(result == null)  result = "{";
            else                result += ",";
            each = list.get(x);
            result += ("\"" + each.getNo() + ":" + each);
        }
        result += "}";

        return result;
    } // End of  getCustomers()

    public String getBasicInfo(String compId, String userNo){
        String result = null;
        String[] data = new String[5];
        Map<String, String> map = null;

        map = commonMapper.getCompanyInfo(compId);

        if(map != null){
            data[0] = map.get("comname");
            data[1] = map.get("comaddress");
            data[2] = map.get("comnamephone");
            data[3] = map.get("comfax");
            data[4] = map.get("comboss");
            result = "{\"my\":" + userNo + ",";
            result += ("\"company\":{");
            result += ("\"name\":\"" + data[0] + "\",");
            result += ("\"address\":\"" + data[1] + "\",");
            result += ("\"phone\":\"" + data[2] + "\",");
            result += ("\"fax\":\"" + data[3] + "\",");
            result += ("\"ceo\":\"" + data[4] + "\"}}");
        }
        return result;
    } // End of getBasicInfo

}
