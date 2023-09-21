package kr.co.bizcore.v1.ctrl;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.bizcore.v1.domain.Sales;
import kr.co.bizcore.v1.domain.Sopp;
import kr.co.bizcore.v1.msg.Msg;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/sopp")
@Slf4j
public class ApiSoppCtrl extends Ctrl{

    private static final Logger logger = LoggerFactory.getLogger(ApiSoppCtrl.class);

    @GetMapping("")
    public String soppList(HttpServletRequest request) {
        String result = null, data = null, aesKey = null, aesIv = null, userNo = null, compId = null;
        int compNo = 0;
        HttpSession session = null;
        Msg msg = null;
        List<Sopp> list = null;
        int i = 0;
        
        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        compNo = (int) session.getAttribute("compNo");
        userNo = (String) session.getAttribute("userNo");
        msg = getMsg((String) session.getAttribute("lang"));
        if (compNo == 0)
        compNo = (int) request.getAttribute("compNo");
            
        if (compNo == 0) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compNoNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            Sopp sopp = new Sopp();
            sopp.setCompNo(compNo);
            list = soppService.getSoppList(sopp);
            if (list != null) {
                data = "[";
                for (i = 0; i < list.size(); i++) {
                    if (i > 0)
                    data += ",";
                    data += list.get(i).toJson();
                }
                data += "]";
            } else {
                data = "[]";
            }
            data = soppService.encAes(data, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";            
        }

        return result;
    }

    @RequestMapping(value = "/{no}", method = RequestMethod.GET)
    public String getDetail(HttpServletRequest req, @PathVariable String no) {
        HttpSession session = null;
        String compId = null;
        int compNo = 0;
        String result = null;
        String userNo = null;
        Sopp sopp = null;
        String data = null;
        String aesKey, aesIv = null;

        if (no == null) { // 글 번호 확인 안됨
            result = "{\"result\":\"failure\",\"msg\":\"salesNo is not exist\"}";
        } else { // 글 번호 확인 됨
            session = req.getSession();
            compId = (String) session.getAttribute("compId");
            compNo = (int) session.getAttribute("compNo");
            aesKey = (String) session.getAttribute("aesKey");
            aesIv = (String) session.getAttribute("aesIv");
            if (compId == null)
                compId = (String) req.getAttribute("compId");
            userNo = (String) session.getAttribute("userNo");

            if (compId == null) { // 회사코드 확인 안됨
                result = "{\"result\":\"failure\",\"msg\":\"Company ID is not verified.\"}";
            } else if (userNo == null) {
                result = "{\"result\":\"failure\",\"msg\":\"Session expired and/or Not logged in.\"}";
            } else { // 회사코드 확인 됨
                sopp = soppService.getSopp(compNo, no); // 삭제(update) 카운트를 실제 삭제 여부를 확인함

                if (sopp != null) { // 처리됨
                    data = sopp.toJson();
                    data = soppService.encAes(data, aesKey, aesIv);
                    result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
                    
                } else { // 처리 안됨
                    result = "{\"result\":\"failure\",\"msg\":\"Error occured when read.\"}";
                } // End of if : 3
            } // End of if : 2
        } // End of if : 1
        return result;
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public String insert(HttpServletRequest req, @RequestBody String requestBody) throws JsonMappingException, JsonProcessingException {

        int compNo = 0;
        HttpSession session = null;
        String result = null;
        String data = null, aesKey = null, aesIv = null;
        ObjectMapper mapper = new ObjectMapper();
        int check = 0;

        session = req.getSession();

        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        compNo = (int) session.getAttribute("compNo");
        data = soppService.decAes(requestBody, aesKey, aesIv);
        Sopp sopp = mapper.readValue(data, Sopp.class);
        sopp.setCompNo(compNo);
        
        if(sopp.getSoppTargetDate().equals("")){
            sopp.setSoppTargetDate(null);
        }

        if(sopp.getMaintenance_S().equals("")){
            sopp.setMaintenance_S(null);
        }

        if(sopp.getMaintenance_E().equals("")){
            sopp.setMaintenance_E(null);
        }

        check = soppService.insertSopp(sopp);

        if (check > 0) {
            result = "{\"result\":\"ok\"}";
        } else {
            result = "{\"result\":\"failure\" ,\"msg\":\"Error occured when write.\"}";
        }

        return result;
    }

    @RequestMapping(value = "/{no}", method = RequestMethod.DELETE)
    public String delete(HttpServletRequest req, @PathVariable String no) {

        HttpSession session = null;
        String compId = null;
        int compNo = 0;
        String result = null;
        String userNo = null;
        String uri = req.getRequestURI();
        String[] t = null;
        int num = 0;

        // 글 번호 확인
        if (no == null) { // 글 번호 확인 안됨
            result = "{\"result\":\" failure\",\"msg\":\"notiNo is not exist\"}";
        } else { // 글 번호 확인 됨
            session = req.getSession();

            userNo = (String) session.getAttribute("userNo");
            compNo = (int) session.getAttribute("compNo");
            compId = (String) session.getAttribute("compId");
            if (compId == null)
                compId = (String) req.getAttribute("compId");

            if (compId == null) { // 회사코드 확인 안됨
                result = "{\"result\":\" failure\",\"msg\":\"Company ID is not verified.\"}";
            } else if (userNo == null) {
                result = "{\"result\":\"failure\",\"msg\":\"Session expired and/or Not logged in.\"}";
            } else { // 회사코드 확인 됨
                num = soppService.delete(compNo, no); // 삭제(update) 카운트를 실제 삭제 여부를 확인함
                if (num > 0) { // 처리됨
                    result = "{\"result\":\"ok\"}";
                } else { // 처리 안됨
                    result = "{\"result\":\" failure\",\"msg\":\"Error occured when delete.\"}";
                } // End of if : 3
            } // End of if : 2
        } // End of if : 1
        return result;
    }
    
    @RequestMapping(value = "/{no}", method = RequestMethod.PUT)
    public String update(HttpServletRequest req, @RequestBody String requestBody, @PathVariable String no) throws JsonMappingException, JsonProcessingException {
        String compId = null;
        int compNo = 0;
        String result = null;
        HttpSession session = null;
        String data = null, aesKey = null, aesIv = null;
        ObjectMapper mapper = new ObjectMapper();

        session = req.getSession();
        compNo = (int) session.getAttribute("compNo");
        compId = (String) session.getAttribute("compId");
        if (compId == null) {
            compId = (String) req.getAttribute("compId");
        }

        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        data = soppService.decAes(requestBody, aesKey, aesIv);
        Sopp sopp = mapper.readValue(data, Sopp.class);
        sopp.setCompNo(compNo);

        if (soppService.updateSopp(sopp) > 0) {
            result = "{\"result\":\"ok\"}";
        }

        return result;
    }

    // @RequestMapping(value = "/{no:\\d+}", method = RequestMethod.GET)
    // public String apiSoppNumber(HttpServletRequest request, @PathVariable int no){
    //     String result = null;
    //     String compId = null;
    //     String aesKey = null;
    //     String aesIv = null;
    //     String sopp = null;
    //     HttpSession session = null;

    //     session = request.getSession();
    //     compId = (String)session.getAttribute("compId");
    //     aesKey = (String)session.getAttribute("aesKey");
    //     aesIv = (String)session.getAttribute("aesIv");
    //     if(compId == null)  compId = (String)request.getAttribute("compId");

    //     if(compId == null){
    //         result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
    //     }else if(aesKey == null || aesIv == null){
    //         result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
    //     }else{
    //         sopp = soppService.getSopp(no, compId, aesKey, aesIv);
    //         if(sopp == null){
    //             result = "{\"result\":\"failure\",\"msg\":\"Sopp not exist.\"}";
    //         }else{
    //             result = soppService.encAes(sopp, aesKey, aesIv);
    //             result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
    //         }
    //     }

    //     return result;
    // } // End of apiSoppNumber()

    // @RequestMapping(value = "/{no:\\d+}/schedule", method = RequestMethod.GET)
    // public String apiSoppNumberSchedule(HttpServletRequest request, @PathVariable int soppNo){
    //     String result = null;
    //     String compId = null;
    //     String aesKey = null;
    //     String aesIv = null;
    //     String data = null;
    //     HttpSession session = null;

    //     session = request.getSession();
    //     compId = (String)session.getAttribute("compId");
    //     aesKey = (String)session.getAttribute("aesKey");
    //     aesIv = (String)session.getAttribute("aesIv");
    //     if(compId == null)  compId = (String)request.getAttribute("compId");

    //     if(compId == null){
    //         result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
    //     }else if(aesKey == null || aesIv == null){
    //         result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
    //     }else{
    //         data = scheduleSvc.getScheduleRelatedSopp(compId, soppNo);
    //         if(data == null){
    //             result = "{\"result\":\"failure\",\"msg\":\"Sopp not exist.\"}";
    //         }else{
    //             data = soppService.encAes(data, aesKey, aesIv);
    //             result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
    //         }
    //     }

    //     return result;
    // } // End of apiSoppNumberSchedule()

    // @RequestMapping(value = "", method = RequestMethod.POST)
    // public String apiSoppPost(HttpServletRequest request, @RequestBody String requestBody) {
    //     String result = null;
    //     String compId = null;
    //     String aesKey = null;
    //     String aesIv = null;
    //     String data = null;
    //     ObjectMapper mapper = null;
    //     Sopp sopp = null;
    //     HttpSession session = null;

    //     mapper = new ObjectMapper();
    //     session = request.getSession();
    //     compId = (String)session.getAttribute("compId");
    //     aesKey = (String)session.getAttribute("aesKey");
    //     aesIv = (String)session.getAttribute("aesIv");
    //     if(compId == null)  compId = (String)request.getAttribute("compId");

    //     if(compId == null){
    //         result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
    //     }else if(aesKey == null || aesIv == null){
    //         result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
    //     }else{
    //         data = procureService.decAes(requestBody, aesKey, aesIv);
    //         if(data == null){
    //             result = "{\"result\":\"failure\",\"msg\":\"Decryption fail.\"}";
    //         }else   try {
    //             sopp = mapper.readValue(data, Sopp.class);
    //             if(soppService.addSopp(sopp, compId))  result = "{\"result\":\"ok\"}";
    //             else                                   result = "{\"result\":\"failure\",\"msg\":\"An error occurred\"}";
    //         } catch (Exception e) {e.printStackTrace();result = "{\"result\":\"failure\",\"msg\":\"An error occurred\"}";}
    //     }
    //     return result;
    // }

    // @RequestMapping(value = "/{no}", method = RequestMethod.PUT)
    // public String apiSoppPut(HttpServletRequest request, @RequestBody String requestBody, @PathVariable String no) {
    //     String result = null;
    //     String compId = null;
    //     String aesKey = null;
    //     String aesIv = null;
    //     String data = null;
    //     ObjectMapper mapper = null;
    //     Sopp sopp = null;
    //     HttpSession session = null;

    //     mapper = new ObjectMapper();
    //     session = request.getSession();
    //     compId = (String)session.getAttribute("compId");
    //     aesKey = (String)session.getAttribute("aesKey");
    //     aesIv = (String)session.getAttribute("aesIv");
    //     if(compId == null)  compId = (String)request.getAttribute("compId");

    //     if(compId == null){
    //         result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
    //     }else if(aesKey == null || aesIv == null){
    //         result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
    //     }else{
    //         data = procureService.decAes(requestBody, aesKey, aesIv);
    //         if(data == null){
    //             result = "{\"result\":\"failure\",\"msg\":\"Decryption fail.\"}";
    //         }else   try {
    //             sopp = mapper.readValue(data, Sopp.class);
    //             if(soppService.modifySopp(no, sopp, compId))    result = "{\"result\":\"ok\"}";
    //             else                                            result = "{\"result\":\"failure\",\"msg\":\"An error occurred\"}";
    //         } catch (Exception e) {e.printStackTrace();result = "{\"result\":\"failure\",\"msg\":\"An error occurred\"}";}
    //     }
    //     return result;
    // }

    // @RequestMapping(value = "/{no}", method = RequestMethod.DELETE)
    // public String apiSoppPut(HttpServletRequest request, @PathVariable String no) {
    //     String result = null;
    //     String compId = null;
        
    //     HttpSession session = null;

    //     session = request.getSession();
    //     compId = (String)session.getAttribute("compId");
    //     if(compId == null)  compId = (String)request.getAttribute("compId");

    //     if(compId == null){
    //         result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
    //     }else{
    //         if(soppService.removeSopp(no, compId))  result = "{\"result\":\"ok\"}";
    //         else                                    result = "{\"result\":\"failure\",\"msg\":\"An error occurred\"}";
    //     }
    //     return result;
    // }
    
}
