package kr.co.bizcore.v1.ctrl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.bizcore.v1.msg.Msg;

@RestController
@RequestMapping("/api/manage")
public class ApiManageCtrl extends Ctrl{

    private static final Logger logger = LoggerFactory.getLogger(ApiManageCtrl.class);

    private String[] myPermission(String compId, String userNo){return manageSvc.getManagePermission(compId, userNo);}

    @GetMapping("/permission/{employee:\\d+}")
    public String permissionGet(HttpServletRequest request, @PathVariable("employee") int employee){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String userNo = null;
        Msg msg = null;
        HttpSession session = null;

        session = request.getSession();
        msg = getMsg((String)session.getAttribute("lang"));
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        compId = (String)session.getAttribute("compId");
        userNo = (String)session.getAttribute("userNo");
        if(compId == null)  compId = (String)request.getAttribute("compId");
        
        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            result = manageSvc.getEmployeeDetailInfo(compId, employee);
            result = encAes(result, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
        }

        return result;
    }

    // 관리자용 -- 직원정보를 가져오는 메서드
    @GetMapping("/employee/{dept}/{employee:\\d+}")
    public String apiSystemGoalYearUsernoGet(HttpServletRequest request, @PathVariable("dept") String dept, @PathVariable("employee") int employee){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String userNo = null;
        String basic = null, annualLeave = null, permission = null, card = null;
        Msg msg = null;
        HttpSession session = null;

        session = request.getSession();
        msg = getMsg((String)session.getAttribute("lang"));
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        compId = (String)session.getAttribute("compId");
        userNo = (String)session.getAttribute("userNo");
        if(compId == null)  compId = (String)request.getAttribute("compId");
        
        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            basic = manageSvc.getEmployeeDetailInfo(compId, employee);
            annualLeave = manageSvc.getUsedAnnualLeave(compId, employee);
            permission = manageSvc.getPermissionWithDept(compId, dept, employee);
            result = "{\"basic\":" + basic + ",";
            result += ("\"permission\":" + permission + ",");
            result += ("\"annualLeave\":" + annualLeave + "}");
            result = encAes(result, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
        }

        return result;
    }

    @GetMapping("/corporateasset")
    public String apiSystemcorporatecardGet(HttpServletRequest request){
        String result = null, card = null, vehicle = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        Msg msg = null;
        HttpSession session = null;

        session = request.getSession();
        msg = getMsg((String)session.getAttribute("lang"));
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");
        
        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            card = manageSvc.getCorporateCardList(compId);
            vehicle = manageSvc.getCorporateVehicleList(compId);
            result = "{\"card\":" + card + ",";
            result += ("\"vehicle\":" + vehicle + "}");
            result = encAes(result, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
        }

        return result;
    }
    
}
