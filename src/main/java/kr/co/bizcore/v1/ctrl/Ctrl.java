package kr.co.bizcore.v1.ctrl;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Controller;

import kr.co.bizcore.v1.msg.Msg;
import kr.co.bizcore.v1.msg.MsgKor;
import kr.co.bizcore.v1.svc.AccountingService;
import kr.co.bizcore.v1.svc.AccountingService2;
import kr.co.bizcore.v1.svc.AttachedService;
import kr.co.bizcore.v1.svc.BoardService;
import kr.co.bizcore.v1.svc.ContService;
import kr.co.bizcore.v1.svc.ContractService;
import kr.co.bizcore.v1.svc.CustService;
import kr.co.bizcore.v1.svc.DeptService;
import kr.co.bizcore.v1.svc.EstimateSvc;
import kr.co.bizcore.v1.svc.GwService;
import kr.co.bizcore.v1.svc.ManageSvc;
import kr.co.bizcore.v1.svc.NotesService;
import kr.co.bizcore.v1.svc.ProcureService;
import kr.co.bizcore.v1.svc.ProductService;
import kr.co.bizcore.v1.svc.SalesService;
import kr.co.bizcore.v1.svc.Schedule2Svc;
import kr.co.bizcore.v1.svc.ScheduleService;
import kr.co.bizcore.v1.svc.ScheduleSvc;
import kr.co.bizcore.v1.svc.SoppService;
import kr.co.bizcore.v1.svc.ProjectService;
import kr.co.bizcore.v1.svc.SystemService;
import kr.co.bizcore.v1.svc.TestService;
import kr.co.bizcore.v1.svc.TradeService;
import kr.co.bizcore.v1.svc.UserService;

@Controller
public abstract class Ctrl {

    private static Msg msgKor = new MsgKor();

    @Autowired
    protected ApplicationContext applicationContext;

    @Autowired
    protected SystemService systemService;

    @Autowired
    protected UserService userService;

    @Autowired
    protected DeptService deptService;

    @Autowired
    protected CustService custService;

    @Autowired
    protected ScheduleSvc scheduleSvc;

    @Autowired
    protected ScheduleService scheduleService;

    @Autowired
    protected BoardService boardService;

    @Autowired
    protected SoppService soppService;

    @Autowired
    protected ContService contService;

    @Autowired
    protected SalesService salesService;

    @Autowired
    protected ProductService productService;

    @Autowired
    protected ProcureService procureService;

    @Autowired
    protected ContractService contractService;

    @Autowired
    protected AttachedService attachedService;

    @Autowired
    protected GwService gwService;

    @Autowired
    protected EstimateSvc estimateSvc;

    @Autowired
    protected TradeService tradeService;

    @Autowired
    protected AccountingService accService;

    @Autowired
    protected AccountingService2 accService2;

    @Autowired
    protected TestService testService;

    @Autowired
    protected ManageSvc manageSvc;

    @Autowired
    protected ProjectService projSvc; 

    @Autowired 
    protected NotesService notes;

    @Autowired
    protected Schedule2Svc schedule2Svc;

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

    public Msg getMsg(String lang){
        if(lang == null)    return msgKor;
        if(lang.toLowerCase().equals("ko-kr"))  return msgKor;
        return msgKor;
    }

    protected void doIt(HttpServletRequest request){
        String uri = null, pathName = null, tempStr = null;
        String[] tempStrArr = null;

        uri = request.getRequestURI();
        if (uri.substring(0, 1).equals("/"))
            uri = uri.substring(1);
        if (uri.substring(uri.length() - 1).equals("/"))
            uri = uri.substring(0, uri.length() - 1);

        tempStrArr = uri.split("/");
        if (tempStrArr.length == 0) {
            pathName = "root";
        } else if (tempStrArr.length == 1) {
            pathName = tempStrArr[0];
        } else if (tempStrArr.length > 1) {
            tempStr = tempStrArr[1];
            pathName = tempStrArr[0];
            pathName += tempStr.substring(0, 1).toUpperCase();
            pathName += tempStr.substring(1).toLowerCase();
        }
        request.getSession().setAttribute("pathName", pathName);
    }
    

}
