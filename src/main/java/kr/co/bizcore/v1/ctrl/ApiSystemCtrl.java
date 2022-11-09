package kr.co.bizcore.v1.ctrl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.json.JSONArray;
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
import com.fasterxml.jackson.databind.ObjectMapper;

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
    public String customerPost(HttpServletRequest request, @RequestBody String requestBody) throws JsonMappingException, JsonProcessingException{
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String data = null;
        ObjectMapper mapper = null;
        Customer customer = null;
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
            mapper = new ObjectMapper();
            customer = mapper.readValue(data, Customer.class);
            no = systemService.addCustomer(compId, customer);
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
        ObjectMapper mapper = null;
        Customer customer = null;
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
            mapper = new ObjectMapper();
            customer = mapper.readValue(data, Customer.class);
            customer.setNo(no);
            x = systemService.modifyCustomer(compId, customer);
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

        logger.error("||||||||||||||||||||||||||||||||||||||||||| " + version);

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
    @GetMapping("/product")
    public String productGet(HttpServletRequest request){
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
            result = systemService.getProductList(compId);
            result = encAes(result, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
        }

        return result;
    } // End of productGet()


}
