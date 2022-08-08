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
import kr.co.bizcore.v1.svc.ContractService;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/system")
@Slf4j
public class SystemCtrl extends Ctrl {

    private static final Logger logger = LoggerFactory.getLogger(SystemCtrl.class);

    @Autowired
    private ContractService svc;

    @RequestMapping(value = "/connUrl", method = RequestMethod.GET)
    public String connUrl() {
        return systemService.getConnUrl();
    } // End of connUrl()

    @GetMapping("/test")
    public String test(){
        String result = null;

        Contract e1 = svc.getContract(105191, "vtek");
        Contract e2 = svc.getContract(105190, "vtek");

        

        //result = est1.createUpdateQuery(est2, "tbl");
        result = e1.createUpdateQuery(e2, null);

        return result;
    } // End of test()

}
