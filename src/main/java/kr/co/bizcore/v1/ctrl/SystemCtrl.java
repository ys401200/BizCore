package kr.co.bizcore.v1.ctrl;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import kr.co.bizcore.v1.domain.Estimate;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/system")
@Slf4j
public class SystemCtrl extends Ctrl {

    private static final Logger logger = LoggerFactory.getLogger(SystemCtrl.class);

    @RequestMapping(value = "/connUrl", method = RequestMethod.GET)
    public String connUrl() {
        return systemService.getConnUrl();
    } // End of connUrl()

    @GetMapping("/test")
    public String test(){
        String result = null;

        Estimate est1 = new Estimate();
        Estimate est2 = new Estimate();

        est1.setAddress("address");
        est1.setAmount(1234567890);
        est1.setCeo("ceo");
        est1.setCompany("company");
        est1.setContent("content");
        est1.setCreated(new Date());
        est1.setCustomer(12345);
        est1.setDate(new Date());
        est1.setDiscount(90);
        est1.setFax("fax");

        est2.setAddress("address");
        est2.setAmount(1234567890);
        est2.setCeo("ceoaaaa");
        est2.setCompany("company");
        est2.setContent("game!!!!");
        est2.setCreated(new Date(est1.getCreated().getTime() - 86400000));
        est2.setCustomer(12345);
        est2.setDate(new Date());
        est2.setDiscount(90);
        est2.setFax("fax");

        result = est1.compareAndCreateQuery(est2, "TBL");

        return result;
    } // End of test()

}
