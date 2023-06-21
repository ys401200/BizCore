package kr.co.bizcore.v1.ctrl;

import java.util.List;

import javax.script.CompiledScript;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.bizcore.v1.domain.Contract2;
import kr.co.bizcore.v1.msg.Msg;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/contract")
@Slf4j
public class ApiContractCtrl extends Ctrl {

    private static final Logger logger = LoggerFactory.getLogger(ApiContractCtrl.class);

    // 계약 전부
    @RequestMapping(value = "", method = RequestMethod.GET)
    public String apiProcureGetAll(HttpServletRequest request) {
        String result = null, aesKey = null, aesIv = null, compId = null, lang = null;
        Msg msg = null;
        int compNo = 0;
        HttpSession session = null;
        String list = null;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        compNo = (int) session.getAttribute("compNo");
        lang = (String) session.getAttribute("lang");
        msg = getMsg(lang);
        compId = (String) session.getAttribute("compId");
        if (compId == null)
            compId = (String) request.getAttribute("compId");

        if (compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        } else if (aesKey == null || aesIv == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        } else
            list = contractService.getContractList(compNo);
            logger.info(list.toString());
        if (list == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.noResult + "\"}";
        } else {
            list = encAes(list, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + list + "\"}";
        }
        return result;
    }

    // 계약 일부
    @RequestMapping(value = "/{start:\\d+}/{end:\\d+}", method = RequestMethod.GET)
    public String apiProcureGet(HttpServletRequest request, @PathVariable("start") int start,
            @PathVariable("end") int end) {
        String result = null, aesKey = null, aesIv = null, compId = null, lang = null;
        Msg msg = null;
        int compNo = 0;
        int count = -9999;
        HttpSession session = null;
        String list = null;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        compNo = (int) session.getAttribute("compNo");
        lang = (String) session.getAttribute("lang");
        msg = getMsg(lang);
        compId = (String) session.getAttribute("compId");
        if (compId == null)
            compId = (String) request.getAttribute("compId");
        if (compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        } else if (aesKey == null || aesIv == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        } else
            list = contractService.getContractList(compNo, start, end);
        count = contractService.getContractCount(compNo);
        if (list == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.noResult + "\"}";
        } else {
            list = encAes(list, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + list + "\",\"count\":" + count + ",\"start\":" + start
                    + ",\"end\":" + end + "}";
        }
        return result;
    }

    @RequestMapping(value = "/{no:\\d+}", method = RequestMethod.GET)
    public String getDetail(HttpServletRequest request, @PathVariable int no) {
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String data = null;
        String lang = null;
        Msg msg = null;
        HttpSession session = null;

        session = request.getSession();
        compId = (String) session.getAttribute("compId");
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        lang = (String) session.getAttribute("lang");
        msg = getMsg(lang);
        if (compId == null)
            compId = (String) request.getAttribute("compId");
        if (compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        } else if (no == -999999) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.noResult + "\"}";
        } else if (no < 0) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.invalidCondition + "\"}";
        } else if (aesKey == null || aesIv == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        } else {
            data = contractService.getContract(no, compId);
            if (data == null) {
                result = "{\"result\":\"failure\",\"msg\":\"" + msg.noResult + "\"}";
            } else {
                data = contractService.encAes(data, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
            }
        }

        return result;
    }

    // parent를 받아서 계약을 찾아 전달해줌
    @GetMapping("/parent/{parent:^\\D+:\\d+$}")
    public String getContractWithParent(HttpServletRequest request, @PathVariable("parent") String parent) {
        String result = null;
        String compId = null;
        HttpSession session = null;
        int contNo = -1;

        session = request.getSession();
        compId = (String) session.getAttribute("compId");
        if (compId == null)
            compId = (String) request.getAttribute("compId");

        contNo = contractService.findContNoWithParent(compId, parent);
        return getDetail(request, contNo);
    } // End of getContractWithParent()

    @RequestMapping(value = "", method = RequestMethod.POST)
    public String apiProcurePost(HttpServletRequest request, @RequestBody String requestBody) {
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String data = null;
        String lang = null;
        Msg msg = null;
        ObjectMapper mapper = null;
        JSONObject json = null;
        Contract2 contract = null;
        HttpSession session = null;

        session = request.getSession();
        compId = (String) session.getAttribute("compId");
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        lang = (String) session.getAttribute("lang");
        msg = getMsg(lang);
        if (compId == null)
            compId = (String) request.getAttribute("compId");

        if (compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        } else if (aesKey == null || aesIv == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        } else {
            data = procureService.decAes(requestBody, aesKey, aesIv);
            if (data == null) {
                result = "{\"result\":\"failure\",\"msg\":\"" + msg.failDecrypt + "\"}";
            } else {
                try {
                    if (contractService.insertContract(data, compId) > 0)
                        result = "{\"result\":\"ok\"}";
                    else
                        result = "{\"result\":\"failure\",\"msg\":\"" + msg.unknownError + "\"}";

                    // mapper = new ObjectMapper();
                    // contract = mapper.readValue(data, Contract.class);
                    // contract.setCreated(null);
                    // if (contractService.addContract(contract, compId))
                    // result = "{\"result\":\"ok\"}";
                    // else
                    // result = "{\"result\":\"failure\",\"msg\":\"" + msg.unknownError + "\"}";
                } catch (Exception e) {
                    result = "{\"result\":\"failure\",\"msg\":\"" + msg.unknownError + "\"}";
                    e.printStackTrace();
                }

            }
        }

        return result;
    } // End of apiProcurePost()

    @RequestMapping(value = "/{no}", method = RequestMethod.PUT)
    public String apiProcureNumberPut(HttpServletRequest request, @RequestBody String requestBody,
            @PathVariable String no) {
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String data = null;
        String lang = null;
        Msg msg = null;
        JSONObject json = null;
        Contract2 contract = null;
        HttpSession session = null;
        ObjectMapper mapper = null;

        session = request.getSession();
        compId = (String) session.getAttribute("compId");
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        lang = (String) session.getAttribute("lang");
        msg = getMsg(lang);
        if (compId == null)
            compId = (String) request.getAttribute("compId");

        if (compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        } else if (aesKey == null || aesIv == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        } else {
            data = procureService.decAes(requestBody, aesKey, aesIv);
            if (data == null) {
                result = "{\"result\":\"failure\",\"msg\":\"" + msg.failDecrypt + "\"}";
            } else {
                try {
                    mapper = new ObjectMapper();
                    contract = mapper.readValue(data, Contract2.class);
                    if (contractService.modifyContract(no, contract, compId))
                        result = "{\"result\":\"ok\"}";
                    else
                        result = "{\"result\":\"failure\",\"msg\":\"" + msg.unknownError + "\"}";
                } catch (Exception e) {
                    result = "{\"result\":\"failure\",\"msg\":\"" + msg.unknownError + "\"}";
                    e.printStackTrace();
                }
            }
        }

        return result;
    } // End of apiProcureNumberPut()

    @RequestMapping(value = "/{no}", method = RequestMethod.DELETE)
    public String apiProcureNumberDelete(HttpServletRequest request, @PathVariable String no) {
        String result = null;
        String compId = null;
        String lang = null;
        Msg msg = null;
        HttpSession session = null;

        session = request.getSession();
        lang = (String) session.getAttribute("lang");
        msg = getMsg(lang);
        compId = (String) session.getAttribute("compId");
        if (compId == null)
            compId = (String) request.getAttribute("compId");

        if (compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        } else {
            if (contractService.removeContract(no, compId))
                result = "{\"result\":\"ok\"}";
            else
                result = "{\"result\":\"failure\",\"msg\":\"" + msg.unknownError + "\"}";
        }

        return result;
    } // End of apiProcureNumberDelete()

    @RequestMapping(value = "/fullContract", method = RequestMethod.GET)
    public String getFullContractData(HttpServletRequest request) {
        HttpSession session = null;
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        String data = null;
        String lang = null;
        Msg msg = null;

        session = request.getSession();
        compId = (String) session.getAttribute("compId");
        aesIv = (String) session.getAttribute("aesIv");
        aesKey = (String) session.getAttribute("aesKey");
        msg = getMsg(lang);

        if (compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        } else if (aesKey == null || aesIv == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        } else {

            data = contractService.getFullContract(compId);
            data = encAes(data, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
        }

        return result;
    }

    // 생성될 계약 번호 가져옴
    @RequestMapping(value = "/nextContNo", method = RequestMethod.GET)
    public String getNextContNo(HttpServletRequest request) {
        String result = null, data = null;
        String compId = null, lang = null;
        String aesKey = null, aesIv = null;
        Msg msg = null;
        HttpSession session = null;

        session = request.getSession();
        compId = (String) session.getAttribute("compId");
        aesIv = (String) session.getAttribute("aesIv");
        aesKey = (String) session.getAttribute("aesKey");
        msg = getMsg(lang);

        if (compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        } else if (aesKey == null || aesIv == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        } else {

            data = contractService.getNextContNo(compId);
            data = encAes(data, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
        }

        return result;
    }

    // // 계약번호로 유지보수 데이터 가져옴
    // @RequestMapping(value = "/maintenance/{contract}", method =
    // RequestMethod.GET)
    // public String getMaintenanceDate(HttpServletRequest request, @PathVariable
    // String contract) {
    // String result = null;
    // String compId = null;
    // String lang = null;
    // Msg msg = null;
    // HttpSession session = null;
    // String list = null;
    // session = request.getSession();
    // lang = (String) session.getAttribute("lang");
    // msg = getMsg(lang);
    // compId = (String) session.getAttribute("compId");
    // if (compId == null)
    // compId = (String) request.getAttribute("compId");

    // if (compId == null) {
    // result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified +
    // "\"}";
    // } else {
    // list = contractService.getMtncData(contract, compId);
    // result = "{\"result\":\"ok\",\"data\":\"" + list + "\"}";
    // }

    // return result;
    // }

    // @GetMapping("/sopp/{sopp:\\d+}/customer/{customer:\\d+}")
    // public String apiContractDetailSchedule(HttpServletRequest request,
    // @PathVariable("sopp") int sopp, @PathVariable("customer") int customer){
    // String result = null, data = null;
    // HttpSession session = null;
    // String compId = null, aesKey = null, aesIv = null;

    // session = request.getSession();
    // compId = (String)session.getAttribute("compId");
    // aesKey = (String)session.getAttribute("aesKey");
    // aesIv = (String)session.getAttribute("aesIv");
    // if(compId == null) compId = (String)request.getAttribute("compId");

    // if(compId == null){
    // result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
    // }else if(aesKey == null || aesIv == null){
    // result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
    // }else{
    // data = contractService.getContract(compId, sopp, customer);
    // if(data != null){
    // data = encAes(data, aesKey, aesIv);
    // result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
    // }else{
    // result = "{\"result\":\"failure\",\"msg\":\"Error occured.\"}";
    // }
    // }

    // return result;
    // }

    @PostMapping("/contractPost")
    public String contractPost(HttpServletRequest request, @RequestBody String requestBody)
            throws JsonMappingException, JsonProcessingException {
        String result = null;
        String compId = null, aesKey = null, aesIv = null, data = null, userNo = null;
        ObjectMapper mapper = null;
        Contract2 contract = null, r = null;
        Msg msg = null;
        HttpSession session = null;

        mapper = new ObjectMapper();
       // mapper.enable(DeserializationFeature.ACCEPT_EMPTY_ARRAY_AS_NULL_OBJECT);
        session = request.getSession();
        compId = (String) session.getAttribute("compId");
        if (compId == null)
            compId = (String) session.getAttribute("compId");
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        userNo = (String) session.getAttribute("userNo");
        msg = getMsg((String) session.getAttribute("lang"));

        if (compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        } else if (aesKey == null || aesIv == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        } else {
            data = decAes(requestBody, aesKey, aesIv);
            logger.info("data check : " + data);
            contract = mapper.readValue(data, Contract2.class);
            r = contractService.updateContract(compId, contract, userNo);
            if (r != null) {
                result = r.toJson();
                result = "{\"result\":\"ok\",\"data\":\"" + encAes(result, aesKey, aesIv) + "\"}";
            } else {
                result = "{\"result\":\"failure\",\"msg\":\"update fail.\"}";
            }
        }

        return result;
    } // End of contractPost();

}
