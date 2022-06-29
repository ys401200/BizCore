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
        System.out.println("[SystemService] ::::::::::::: size : " + data.size());
        for (ConnUrl each : data) {
            result = each.getConnAddrl() + " / " + each.getCompId();
            System.out.println(result);
        }
        return result;
    } // End of getConnUrl()

}
