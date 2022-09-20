package kr.co.bizcore.v1.ctrl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Controller;

import kr.co.bizcore.v1.svc.AccountingService;
import kr.co.bizcore.v1.svc.AttachedService;
import kr.co.bizcore.v1.svc.BoardService;
import kr.co.bizcore.v1.svc.ContractService;
import kr.co.bizcore.v1.svc.DeptService;
import kr.co.bizcore.v1.svc.GwService;
import kr.co.bizcore.v1.svc.ProcureService;
import kr.co.bizcore.v1.svc.SalesService;
import kr.co.bizcore.v1.svc.ScheduleSvc;
import kr.co.bizcore.v1.svc.SoppService;
import kr.co.bizcore.v1.svc.SystemService;
import kr.co.bizcore.v1.svc.TestService;
import kr.co.bizcore.v1.svc.TradeService;
import kr.co.bizcore.v1.svc.UserService;

@Controller
public abstract class Ctrl {

    private static Msg msgKor = new MsgKor();
    private static Msg msgEng = new MsgEng();

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
    protected AttachedService attachedService;

    @Autowired
    protected GwService gwService;

    @Autowired
    protected TradeService tradeService;

    @Autowired
    protected AccountingService accService;

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

    protected Msg getMsg(String lang){
        if(lang == null)    return msgEng;
        if(lang.toLowerCase().equals("ko=kr"))  return msgKor;
        return msgEng;
    }
    

}

interface Msg{
    public String notLoggedin = "0001/Session expired or Not logged in.";
    public String compIdNotVerified = "0002/Company ID is Not verified.";
    public String aesKeyNotFound = "0003/Encryption key is not set.";
    public String wrongDateFormat = "0004/Wrong date format.";
    public String fileNotFound = "0006/File not found or removed.";
    public String permissionDenied = "0007/Permission denied";
    public String unknownError = "9999/An error occurred while processing your request.";
}
class MsgKor implements Msg{
    public String notLoggedin = "0001/세션이 만료되었거나 로그인하지 않았습니다.";
    public String compIdNotVerified = "0002/고객사 아이디를 확인할 수 없습니다.";
    public String aesKeyNotFound = "0003/암호화 키를 찾을 수 없습니다.";
    public String wrongDateFormat = "0004/날짜 포맷이 잘못되었습니다.";
    public String fileNotFound = "0006/파일이 존재하지 않거나 제거되었습니다.";
    public String permissionDenied = "0007/접근 권한이 없습니다.";
    public String unknownError = "9999/요청을 처리하는 중 문제가 발생했습니다.";
}
class MsgEng implements Msg{
    
}