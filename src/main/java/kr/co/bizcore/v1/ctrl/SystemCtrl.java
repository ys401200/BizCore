package kr.co.bizcore.v1.ctrl;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import kr.co.bizcore.v1.domain.TradeDetail;
import kr.co.bizcore.v1.svc.TradeService;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/system")
@Slf4j
public class SystemCtrl extends Ctrl {

    private static final Logger logger = LoggerFactory.getLogger(SystemCtrl.class);

    @Autowired
    private TradeService svc;

    @RequestMapping(value = "/connUrl", method = RequestMethod.GET)
    public String connUrl() {
        return systemService.getConnUrl();
    } // End of connUrl()

    @GetMapping("/test")
    public String test(){
        String result = null;

        TradeDetail e1 = null, e2 = null;
        e1 = svc.getTradeDetail(1825+"");
        e2 = svc.getTradeDetail(1828+"");

        

        //result = e1.createInsertQuery(null, null);
        result = e1.createUpdateQuery(e2, null);

        return result;
    } // End of test()

}
