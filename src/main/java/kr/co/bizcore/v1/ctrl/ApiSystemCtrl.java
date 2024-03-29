package kr.co.bizcore.v1.ctrl;

import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import kr.co.bizcore.v1.domain.Customer;
import kr.co.bizcore.v1.msg.Msg;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/system")
@Slf4j
public class ApiSystemCtrl extends Ctrl{

    private static final Logger logger = LoggerFactory.getLogger(ApiSystemCtrl.class);

    @GetMapping("/customer")
    public String customer(HttpServletRequest request){ // 맵 형식
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        Msg msg = null;
        HttpSession session = null;

        session = request.getSession();
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        compId = (String)session.getAttribute("compId");
        msg = getMsg((String)session.getAttribute("lang"));
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            result = systemService.getCustomers(compId, true);
            result = systemService.encAes(result, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
        }
        return result;
    } // End of customer

    @GetMapping("/customer2")
    public String customer2(HttpServletRequest request){ // 배열 형식
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        Msg msg = null;
        HttpSession session = null;

        session = request.getSession();
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        compId = (String)session.getAttribute("compId");
        msg = getMsg((String)session.getAttribute("lang"));
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            result = systemService.getCustomers(compId, false);
            result = systemService.encAes(result, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
        }
        return result;
    } // End of customer

    @GetMapping("/customer/{no:\\d{6,7}}")
    public String customerByNo(HttpServletRequest request, @PathVariable int no){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        Msg msg = null;
        HttpSession session = null;

        session = request.getSession();
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        compId = (String)session.getAttribute("compId");
        msg = getMsg((String)session.getAttribute("lang"));
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            result = systemService.getCustomerByNo(compId, no);
            result = encAes(result, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
        }
        return result;
    } // End of customer

    @GetMapping("/customer/{taxid:\\d{3}-\\d{2}-\\d{5}}")
    public String customerByTaxid(HttpServletRequest request, @PathVariable("taxid") String taxId){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        Msg msg = null;
        HttpSession session = null;

        session = request.getSession();
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        compId = (String)session.getAttribute("compId");
        msg = getMsg((String)session.getAttribute("lang"));
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            result = systemService.getCustomerByTaxId(compId, taxId);
            result = encAes(result, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
        }
        return result;
    } // End of customer

    @PostMapping("/customer")
    public String customerPost(HttpServletRequest request, @RequestBody String requestBody) {
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String data = null;
        JSONObject json = null, jsonSub = null;
        Customer cst = null;
        Msg msg = null;
        HttpSession session = null;
        int no = -1;

        session = request.getSession();
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        compId = (String)session.getAttribute("compId");
        msg = getMsg((String)session.getAttribute("lang"));
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.dataIsWornFormat + "\"}";
            data = decAes(requestBody, aesKey, aesIv);
            json = new JSONObject(data);
            cst = new Customer();
            if(!json.isNull("name"))    cst.setName(json.getString("name"));
            if(!json.isNull("taxId"))   cst.setTaxId(json.getString("taxId"));
            if(!json.isNull("ceoName")) cst.setCeoName(json.getString("ceoName"));
            if(!json.isNull("email"))   cst.setEmail(json.getString("email"));
            if(!json.isNull("emailForTaxbill")) cst.setEmailForTaxbill(json.getString("emailForTaxbill"));
            if(!json.isNull("zipCode"))   cst.setZipCode(json.getInt("zipCode"));
            if(!json.isNull("address"))   cst.setAddress(json.getJSONArray("address").toString());
            if(!json.isNull("phone"))   cst.setPhone(json.getString("phone"));
            if(!json.isNull("fax"))     cst.setFax(json.getString("fax"));
            if(!json.isNull("remark1")) cst.setRemark1(json.getString("remark1"));
            if(!json.isNull("remark2")) cst.setRemark2(json.getString("remark2"));
            if(!json.isNull("related")) cst.setRelated(json.getJSONObject("related").toString());

            if(!json.isNull("companyInformation")){
                jsonSub = json.getJSONObject("companyInformation");
                if(!jsonSub.isNull("manufacturer")) cst.setCi_manufacturer(jsonSub.getBoolean("manufacturer"));
                if(!jsonSub.isNull("partner"))      cst.setCi_partner(jsonSub.getBoolean("partner"));
                if(!jsonSub.isNull("public"))       cst.setCi_public(jsonSub.getBoolean("public"));
                if(!jsonSub.isNull("civilian"))     cst.setCi_civilian(jsonSub.getBoolean("civilian"));
            }

            if(!json.isNull("typeOfSales")){
                jsonSub = json.getJSONObject("typeOfSales");
                if(!jsonSub.isNull("directProcument"))      cst.setTos_directProcument(jsonSub.getBoolean("directProcument"));
                if(!jsonSub.isNull("indirectProcument"))    cst.setTos_indirectProcument(jsonSub.getBoolean("indirectProcument"));
                if(!jsonSub.isNull("agencyProcument"))      cst.setTos_agencyProcument(jsonSub.getBoolean("agencyProcument"));
                if(!jsonSub.isNull("maintenance"))          cst.setTos_maintenance(jsonSub.getBoolean("maintenance"));
                if(!jsonSub.isNull("generalCompany"))       cst.setTos_generalCompany(jsonSub.getBoolean("generalCompany"));
                if(!jsonSub.isNull("hospital"))             cst.setTos_hospital(jsonSub.getBoolean("hospital"));
                if(!jsonSub.isNull("finance"))              cst.setTos_finance(jsonSub.getBoolean("finance"));
                if(!jsonSub.isNull("public"))               cst.setTos_public(jsonSub.getBoolean("public"));
            }

            if(!json.isNull("transactionInformation")){
                jsonSub = json.getJSONObject("transactionInformation");
                if(!jsonSub.isNull("supplier")) cst.setTi_supplier(jsonSub.getBoolean("supplier"));
                if(!jsonSub.isNull("partner"))  cst.setTi_partner(jsonSub.getBoolean("partner"));
                if(!jsonSub.isNull("client"))   cst.setTi_client(jsonSub.getBoolean("client"));
                if(!jsonSub.isNull("notTrade")) cst.setTi_notTrade(jsonSub.getBoolean("notTrade"));
            }
            
            no = systemService.addCustomer(compId, cst);
            if(no > 0)  result = "{\"result\":\"ok\",\"data\":" + no + "}";
            else        result = "{\"result\":\"failure\",\"msg\":\"" + msg.unknownError + "\"}";
            
        }
        return result;
    } // End of customer

    @PutMapping("/customer/{no:\\d+}")
    public String customerPost(HttpServletRequest request, @RequestBody String requestBody, @PathVariable("no") int no) throws JsonMappingException, JsonProcessingException{
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String data = null;
        JSONObject json = null, jsonSub = null;
        Customer cst = null;
        Msg msg = null;
        HttpSession session = null;
        int x = 0;

        session = request.getSession();
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        compId = (String)session.getAttribute("compId");
        msg = getMsg((String)session.getAttribute("lang"));
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.dataIsWornFormat + "\"}";
            data = decAes(requestBody, aesKey, aesIv);
            
            cst = new Customer();
            cst.setNo(no);

            json = new JSONObject(data);
            if(!json.isNull("name"))    cst.setName(json.getString("name"));
            if(!json.isNull("taxId"))   cst.setTaxId(json.getString("taxId"));
            if(!json.isNull("ceoName")) cst.setCeoName(json.getString("ceoName"));
            if(!json.isNull("email"))   cst.setEmail(json.getString("email"));
            if(!json.isNull("emailForTaxbill")) cst.setEmailForTaxbill(json.getString("emailForTaxbill"));
            if(!json.isNull("zipCode"))   cst.setZipCode(json.getInt("zipCode"));
            if(!json.isNull("address"))   cst.setAddress(json.getJSONArray("address").toString());
            if(!json.isNull("phone"))   cst.setPhone(json.getString("phone"));
            if(!json.isNull("fax"))     cst.setFax(json.getString("fax"));
            if(!json.isNull("remark1")) cst.setRemark1(json.getString("remark1"));
            if(!json.isNull("remark2")) cst.setRemark2(json.getString("remark2"));
            if(!json.isNull("related")) cst.setRelated(json.getJSONObject("related").toString());

            if(!json.isNull("companyInformation")){
                jsonSub = json.getJSONObject("companyInformation");
                if(!jsonSub.isNull("manufacturer")) cst.setCi_manufacturer(jsonSub.getBoolean("manufacturer"));
                if(!jsonSub.isNull("partner"))      cst.setCi_partner(jsonSub.getBoolean("partner"));
                if(!jsonSub.isNull("public"))       cst.setCi_public(jsonSub.getBoolean("public"));
                if(!jsonSub.isNull("civilian"))     cst.setCi_civilian(jsonSub.getBoolean("civilian"));
            }

            if(!json.isNull("typeOfSales")){
                jsonSub = json.getJSONObject("typeOfSales");
                if(!jsonSub.isNull("directProcument"))      cst.setTos_directProcument(jsonSub.getBoolean("directProcument"));
                if(!jsonSub.isNull("indirectProcument"))    cst.setTos_indirectProcument(jsonSub.getBoolean("indirectProcument"));
                if(!jsonSub.isNull("agencyProcument"))      cst.setTos_agencyProcument(jsonSub.getBoolean("agencyProcument"));
                if(!jsonSub.isNull("maintenance"))          cst.setTos_maintenance(jsonSub.getBoolean("maintenance"));
                if(!jsonSub.isNull("generalCompany"))       cst.setTos_generalCompany(jsonSub.getBoolean("generalCompany"));
                if(!jsonSub.isNull("hospital"))             cst.setTos_hospital(jsonSub.getBoolean("hospital"));
                if(!jsonSub.isNull("finance"))              cst.setTos_finance(jsonSub.getBoolean("finance"));
                if(!jsonSub.isNull("public"))               cst.setTos_public(jsonSub.getBoolean("public"));
            }

            if(!json.isNull("transactionInformation")){
                jsonSub = json.getJSONObject("transactionInformation");
                if(!jsonSub.isNull("supplier")) cst.setTi_supplier(jsonSub.getBoolean("supplier"));
                if(!jsonSub.isNull("partner"))  cst.setTi_partner(jsonSub.getBoolean("partner"));
                if(!jsonSub.isNull("client"))   cst.setTi_client(jsonSub.getBoolean("client"));
                if(!jsonSub.isNull("notTrade")) cst.setTi_notTrade(jsonSub.getBoolean("notTrade"));
            }
            
            x = systemService.modifyCustomer(compId, cst);
            if(x > 0)  result = "{\"result\":\"ok\",\"data\":" + no + "}";
            else        result = "{\"result\":\"failure\",\"msg\":\"" + msg.unknownError + "\"}";
            
        }
        return result;
    } // End of customer

    @DeleteMapping("/customer/{no:\\d+}")
    public String customerDelete(HttpServletRequest request,@PathVariable("no") int no) {
        String result = null;
        String compId = null;
        Msg msg = null;
        HttpSession session = null;
        int x = 0;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        msg = getMsg((String)session.getAttribute("lang"));
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else{
            x = systemService.removeCustomer(compId, no);
            if(x > 0)  result = "{\"result\":\"ok\",\"data\":" + no + "}";
            else        result = "{\"result\":\"failure\",\"msg\":\"" + msg.unknownError + "\"}";
        }
        return result;
    } // End of customer

    @RequestMapping(value = "/cip", method = RequestMethod.GET)
    public String cip(HttpServletRequest request){
        String result = null;
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
            result = systemService.cipInfo(compId);
            result = encAes(result, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
        }

        return result;
    } // End of customer

    @RequestMapping(value = "/cip/{no:\\d+}", method = RequestMethod.GET)
    public String cipName(HttpServletRequest request, @PathVariable String no){
        String result = null;
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
            result = systemService.cipInfo(compId, no);
            if(result != null){
                result = encAes(result, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
            }else{
                result = "{\"result\":\"failure\",\"data\":\"" + msg.noResult + "\"}";
            }            
        }

        return result;
    } // End of customer

    @RequestMapping(value = "/basic", method = RequestMethod.GET)
    public String basic(HttpServletRequest request){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String userNo = null;
        String version = null;
        Msg msg = null;
        HttpSession session = null;

        session = request.getSession();
        msg = getMsg((String)session.getAttribute("lang"));
        userNo = (String)session.getAttribute("userNo");
        version = (String)session.getAttribute("version");
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            result = systemService.getBasicInfo(compId, userNo, version);
            result = systemService.encAes(result, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
        }

        return result;
    } // End of customer

    @RequestMapping(value = "/code", method = RequestMethod.GET)
    public String code(HttpServletRequest request){
        String result = null;
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
            result = systemService.getCommonCode(compId);
            result = systemService.encAes(result, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
        }

        return result;
    } // End of code()

    // 영업목표를 가져오는 메서드 / 소속 부서 기준
    @GetMapping(value={"/goal/{year:\\d{4}}", "/goal/{year:\\d{4}}"})
    public String apiSystemGoalYearUsernoGet(HttpServletRequest request, @PathVariable("year") int year){
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
            result = systemService.getSalesGoals(compId, userNo, year);
            result = encAes(result, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
        }

        return result;
    }

    // 영업목표를 설정하는 메서드
    @PostMapping("/goal/{year:\\d{4}}/{empNo:\\d+}")
    public String apiSystemGoalYearUsernoPost(HttpServletRequest request, @RequestBody String requestBody, @PathVariable("year") int year, @PathVariable("empNo") int empNo){
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String userNo = null;
        String data = null;
        JSONArray jarr = null;
        long[] larr = null;
        Msg msg = null;
        HttpSession session = null;
        int x = 0;

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
            data = decAes(requestBody, aesKey, aesIv);
            jarr = new JSONArray(data);
            if(jarr != null && jarr.length() >= 12){
                larr = new long[jarr.length()];
                for(x = 0 ; x < jarr.length() ; x++)    larr[x] = jarr.getLong(x);
            }
            result = systemService.setSalesGoal(compId, userNo, year, empNo, larr);
            if(result == null)  result = "{\"result\":\"failure\",\"msg\":\"" + msg.unknownError + "\"}";
            else if(result.equals("permissionDenied"))  result = "{\"result\":\"failure\",\"msg\":\"" + msg.permissionDenied + "\"}";
            else if(result.equals("ok"))  result = "{\"result\":\"ok\"}";
            else    result = "{\"result\":\"failure\",\"msg\":\"" + msg.unknownError + "\"}";
        }        

        return result;

    }

    // 관리자용 -- 직원정보를 가져오는 메서드
    @GetMapping("/manage/employee/{employeeNo:\\d+}")
    public String apiSystemGoalYearUsernoGet(HttpServletRequest request, @PathVariable("employeeNo") String employee){
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
            result = manageSvc.getEmployeeDetailInfo(compId, strToInt(employee));
            result = encAes(result, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
        }

        return result;
    }

    // 제품 전체 조회
    // @GetMapping("/product")
    // public String productGet(HttpServletRequest request){
    //     String result = null;
    //     String compId = null;
    //     String aesKey = null;
    //     String aesIv = null;
    //     String userNo = null;
    //     Msg msg = null;
    //     HttpSession session = null;

    //     session = request.getSession();
    //     msg = getMsg((String)session.getAttribute("lang"));
    //     aesKey = (String)session.getAttribute("aesKey");
    //     aesIv = (String)session.getAttribute("aesIv");
    //     compId = (String)session.getAttribute("compId");
    //     userNo = (String)session.getAttribute("userNo");
    //     if(compId == null)  compId = (String)request.getAttribute("compId");
        
    //     if(compId == null){
    //         result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
    //     }else if(aesKey == null || aesIv == null){
    //         result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
    //     }else{
    //         result = systemService.getProductList(compId);
    //         result = encAes(result, aesKey, aesIv);
    //         result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
    //     }

    //     return result;
    // } // End of productGet()

    // 회사 로고를 전달하는 메서드
    @RequestMapping(value = "/logo", method = RequestMethod.GET)
    public void logoGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String compId = null;
        HttpSession session = null;
        byte[] result = null;
        OutputStream os = null;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            response.setStatus(404);
        }else{
            result = attachedService.getCompanyLogo(compId);
            response.setContentType("image/png");
            os = response.getOutputStream();
            os.write(result);
            os.flush();
        }
    } // End of myImageGet()


}
