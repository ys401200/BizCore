package kr.co.bizcore.v1.ctrl;

import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

    // 법인 차량 등 자산 정보
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

    // 관리페이지 - 인사 기본 정보
    @PostMapping("/employee/basic/{employee:\\d+}")
    public String employeeBasicPost(HttpServletRequest request, @PathVariable("employee") int employee, @RequestBody String requestBody){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String data = null;
        String xAddress = null, xBirthday = null, xCellPhone = null, xEmail = null, xHomePhone = null, xName = null, xPw = null, xRank = null, xResidentNo = null, xResigned = null;
        int xGender = -1, xZipCode = -1, xProhibited = -1;
        boolean r = false;
        JSONObject json = null;
        String[] c = null;
        Msg msg = null;
        HttpSession session = null;systemService.getCompanyAesKey(compId);

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
            data = decAes(requestBody, aesKey, aesIv);
            json = new JSONObject(data);
            xAddress = json.isNull("address") ? null : json.getString("address");
            xBirthday = json.isNull("birthDay") ? null : json.getString("birthDay");
            xCellPhone = json.isNull("cellPhone") ? null : json.getString("cellPhone");
            xEmail = json.isNull("email") ? null : json.getString("email");
            xHomePhone = json.isNull("homePhone") ? null : json.getString("homePhone");
            xName = json.isNull("name") ? null : json.getString("name");
            xPw = json.isNull("pw") ? null : json.getString("pw");
            xRank = json.isNull("rank") ? null : json.getString("rank");
            xResidentNo = json.isNull("residentNo") ? null : json.getString("residentNo");
            xGender = json.isNull("gender") ? -1 : json.getInt("gender");
            xZipCode = json.isNull("zipCode") ? -1 : json.getInt("zipCode");
            xProhibited = json.isNull("prohibited") ? -1 : json.getBoolean("prohibited") ? 1 : 0;
            xResigned = json.isNull("resigned") ? null : json.getString("resigned");

            if(xResidentNo != null){
                c = systemService.getCompanyAesKey(compId);
                xResidentNo = encAes(xResidentNo, c[0], c[1]);
            }

            r = manageSvc.updateEmployeeBasic(employee, compId, xAddress, xBirthday, xCellPhone, xEmail, xHomePhone, xName, xPw, xRank, xResidentNo, xGender, xZipCode, xProhibited, xResigned);
            if(r)   result = "{\"result\":\"ok\"}";
            else    result = "{\"result\":\"failure\"}";
        }

        return result;
    }
    
    // 관리페이지 - 권한 정보
    @PostMapping("/employee/permission/{employee:\\d+}")
    public String employeePermissionPost(HttpServletRequest request, @PathVariable("employee") int employee, @RequestBody String requestBody){
        String result = null;
        String compId = null, aesKey = null, aesIv = null, userNo = null;
        String data = null, xDept = null;
        int xManager = -1, xAccounting = -1, xDoc = -1, xDocmng = -1, xHr = -1, xHead = -1, count = 0;
        boolean r = false;
        JSONObject json = null;
        Msg msg = null;
        HttpSession session = null;

        session = request.getSession();
        msg = getMsg((String)session.getAttribute("lang"));
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        userNo = (String)session.getAttribute("userNo");
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");
        
        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            data = decAes(requestBody, aesKey, aesIv);
            json = new JSONObject(data);
            xDept = json.isNull("dept") ? null : json.getString("dept");
            xAccounting = json.isNull("accounting") ? -1 : json.getBoolean("accounting") ? 1 : 0;
            xDoc = json.isNull("doc") ? -1 : json.getBoolean("accounting") ? 1 : 0;
            xHead = json.isNull("head") ? -1 : json.getBoolean("accounting") ? 1 : 0;
            xHr = json.isNull("hr") ? -1 : json.getBoolean("accounting") ? 1 : 0;
            xDocmng= json.isNull("docmng") ? -1 : json.getBoolean("accounting") ? 1 : 0;
            xManager = json.isNull("manager") ? -1 : json.getBoolean("manager") ? 1 : 0;

            count = manageSvc.updateEmployeePermission(compId, userNo, employee, xDept, xManager, xAccounting, xDoc, xDocmng, xHr, xHead);
            r = count > 0;
            if(r)   result = "{\"result\":\"ok\"}";
            else    result = "{\"result\":\"failure\"}";
            //result = encAes(result, aesKey, aesIv);
            //result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
        }

        return result;
    }

    // 관리페이지 - 지급된 자산 정보
    @PostMapping("/employee/asset/{employee:\\d+}")
    public String employeeAssetPost(HttpServletRequest request, @PathVariable("employee") int employee, @RequestBody String requestBody){
        String result = null;
        String compId = null, aesKey = null, aesIv = null, userNo = null, data = null, xVehicle = null, xHipass = null, t = null;
        JSONObject json = null;
        JSONArray jarr = null;
        ArrayList<String> xCard = new ArrayList<>();
        int x = 0, count = 0;
        Msg msg = null;
        HttpSession session = null;

        session = request.getSession();
        msg = getMsg((String)session.getAttribute("lang"));
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        userNo = (String)session.getAttribute("userNo");
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");
        
        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            data = decAes(requestBody, aesKey, aesIv);
            json = new JSONObject(data);
            xVehicle = json.isNull("vehicle") ? null : json.getString("vehicle");
            xHipass = json.isNull("hipass") ? null : json.getString("hipass");
            jarr = json.isNull("card") ? null : json.getJSONArray("card");
            if(jarr != null && jarr.length() > 0)for(x = 0 ; x < jarr.length() ; x++)    xCard.add(jarr.getString(x));
            
            count = manageSvc.updateEmployeeAsset(compId, userNo, employee, xCard, xVehicle, xHipass);
            if(count > 0)   result = "{\"result\":\"ok\"}";
            else            result = "{\"result\":\"failure\"}";
        }

        return result;
    }
}
