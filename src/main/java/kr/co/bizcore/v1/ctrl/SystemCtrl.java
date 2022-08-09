package kr.co.bizcore.v1.ctrl;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import kr.co.bizcore.v1.domain.Contract;
import kr.co.bizcore.v1.domain.Estimate;
import kr.co.bizcore.v1.domain.Procure;
import kr.co.bizcore.v1.domain.Sales;
import kr.co.bizcore.v1.domain.Sopp;
import kr.co.bizcore.v1.svc.ContractService;
import kr.co.bizcore.v1.svc.ProcureService;
import kr.co.bizcore.v1.svc.SalesService;
import kr.co.bizcore.v1.svc.SoppService;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/system")
@Slf4j
public class SystemCtrl extends Ctrl {

    private static final Logger logger = LoggerFactory.getLogger(SystemCtrl.class);

    @Autowired
    private SoppService svc;

    @RequestMapping(value = "/connUrl", method = RequestMethod.GET)
    public String connUrl() {
        return systemService.getConnUrl();
    } // End of connUrl()

    @GetMapping("/test")
    public String test(){
        String result = null;

        Sopp e1 = null, e2 = null;
        e1 = svc.getSopp(10005608 + "", "vtek");
        e2 = svc.getSopp(10005606 + "", "vtek");

        

        result = e1.createInsertQuery(null, "vtek");
        //result = e1.createUpdateQuery(e2, null);

        return result;
    } // End of test()

}
