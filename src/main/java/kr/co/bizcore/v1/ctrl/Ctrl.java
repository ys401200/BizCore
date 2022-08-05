package kr.co.bizcore.v1.ctrl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Controller;

import kr.co.bizcore.v1.svc.BoardService;
import kr.co.bizcore.v1.svc.ContractService;
import kr.co.bizcore.v1.svc.DeptService;
import kr.co.bizcore.v1.svc.ProcureService;
import kr.co.bizcore.v1.svc.SalesService;
import kr.co.bizcore.v1.svc.ScheduleSvc;
import kr.co.bizcore.v1.svc.SoppService;
import kr.co.bizcore.v1.svc.SystemService;
import kr.co.bizcore.v1.svc.TestService;
import kr.co.bizcore.v1.svc.UserService;

@Controller
public abstract class Ctrl {

    @Autowired
    protected ApplicationContext applicationContext;

    @Autowired
    protected SystemService systemService;

    @Autowired
    protected UserService userService;

    @Autowired
    protected DeptService deptService;

    @Autowired
    protected ScheduleSvc scheduleService;

    @Autowired
    protected BoardService boardService;

    @Autowired
    protected SoppService soppService;

    @Autowired
    protected SalesService salesService;

    @Autowired
    protected ProcureService procureService;

    @Autowired
    protected ContractService contractService;

    @Autowired
    protected TestService testService;

    public int strToInt(String str){
        int result = -1;
        try{result = str != null ? Integer.parseInt(str) : -1;
        }catch(NumberFormatException e){e.printStackTrace();}
        return result;
    }

    public long strToLong(String str){
        long result = -1;
        try{result = str != null ? Long.parseLong(str) : -1;
        }catch(NumberFormatException e){e.printStackTrace();}
        return result;
    }

    protected String encAes(String data, String aesKey, String aesIv){
        return systemService.encAes(data, aesKey, aesIv);
    }

    protected String decAes(String data, String aesKey, String aesIv){
        return systemService.decAes(data, aesKey, aesIv);
    }
    

}
