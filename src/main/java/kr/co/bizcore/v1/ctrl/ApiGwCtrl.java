package kr.co.bizcore.v1.ctrl;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.bizcore.v1.msg.Msg;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/gw")
@Slf4j
public class ApiGwCtrl extends Ctrl{

    private static final Logger logger = LoggerFactory.getLogger(ApiGwCtrl.class);

    // 결재문서 양식의 리스트를 전달
    @GetMapping("/form")
    public String apiGwFormGet(HttpServletRequest request){
        String result = null, data = null, aesKey = null, aesIv = null;
        HttpSession session = null;
        String forms = null, lang = null;
        Msg msg = null;
        int i = 0;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        lang = (String)session.getAttribute("lang");
        msg = getMsg(lang);

        forms = gwService.getForms();
        if (forms == null)  result = "{\"result\":\"failure\",\"msg\":\"" + msg.formNotFound + "\"}";
        else{
            data = encAes(forms, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
        }

        return result;
    } // End of apiGwFormGet()

    // 해당 ID를 가진 결재문서양식을 전달
    @GetMapping("/form/{id}")
    public String apiGwFormGet(HttpServletRequest request, @PathVariable String formId){
        String result = null, data = null, aesKey = null, aesIv = null;
        HttpSession session = null;
        Msg msg = null;
        String form = null, lang = null;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        lang = (String)session.getAttribute("lang");
        msg = getMsg(lang);

        form = gwService.getForm(formId);
        if (form == null)  result = "{\"result\":\"failure\",\"msg\":\"" + msg.formNotFound + "\"}";
        else{
            data = encAes(form, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
        }

        return result;
    } // End of apiGwFormGet()

    // 결재 대기 목록을 전달
    @GetMapping("/app/wait")
    public String apiGwAppWaitGet(HttpServletRequest request){
        String result = null, compId = null, userNo = null, data = null, aesIv = null, aesKey = null, lang = null;
        Msg msg = null;
        HttpSession session = null;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        userNo = (String)session.getAttribute("userNo");
        lang = (String)session.getAttribute("lang");
        msg = getMsg(lang);
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            data = gwService.getWaitAndDueDocList(compId, userNo);
            if(data == null)    result = "{\"result\":\"failure\",\"msg\":\"" + msg.unknownError + "\"}";
            else{
                data = encAes(data, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
            }
            
        }
        return result;
    } // End of apiGwAppWaitGet()

    // 결재 임시 목록을 전달
    @GetMapping("/app/temp")
    public String apiGwAppTempGet(HttpServletRequest request){
        String result = null;

        return result;
    } // End of apiGwAppTempGet()

    // 내 결재 문서 목록을 전달
    @GetMapping("/app/mydraft")
    public String apiGwAppMydraftGet(HttpServletRequest request){
        String result = null, compId = null, userNo = null, data = null, aesIv = null, aesKey = null, lang = null;
        HttpSession session = null;
        Msg msg = null;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        userNo = (String)session.getAttribute("userNo");
        lang = (String)session.getAttribute("lang");
        msg = getMsg(lang);
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            data = gwService.getProceedingDocList(compId, userNo);
            if(data == null)    result = "{\"result\":\"failure\",\"msg\":\"" + msg.unknownError + "\"}";
            else{
                data = encAes(data, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
            }
            
        }
        return result;
    } // End of apiGwAppMydraftGet()

    // 결재 문서를 전달
    @GetMapping("/app/doc/{docNo}")
    public String apiGwAppDocNoGet(HttpServletRequest request, @PathVariable("docNo") String docNo){
        String result = null, compId = null, userNo = null, data = null, aesIv = null, aesKey = null, lang = null, dept = null;
        Msg msg = null;
        HttpSession session = null;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        userNo = (String)session.getAttribute("userNo");
        lang = (String)session.getAttribute("lang");
        msg = getMsg(lang);
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            data = gwService.getAppDocAndDetailInfo(compId, docNo, dept, userNo, aesKey, aesIv);
            if(data == null){
                result = "{\"result\":\"failure\",\"msg\":\"" + msg.unknownError + "\"}";
            }else if(data.equals("notFound")){
                result = "{\"result\":\"failure\",\"msg\":\"" + msg.docNotFound + "\"}";
            }else if(data.equals("errorInAppLine")){
                result = "{\"result\":\"failure\",\"msg\":\"" + msg.errorDocAppLine + "\"}";
            }else if(data.equals("appDocContentIsEmpty")){
                result = "{\"result\":\"failure\",\"msg\":\"" + msg.errorDocBody + "\"}";
            }else if(data.equals("permissionDenied")){
                result = "{\"result\":\"failure\",\"msg\":\"" + msg.permissionDenied+ "\"}";
            }else{
                data = encAes(data, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
            }
            
        }
        return result;
    } // End of apiGwAppDocNoGet()

    // 결재 문서 신규 등록
    @PostMapping("/app/doc")
    public String apiGwAppDocPost(HttpServletRequest request, @RequestBody String requestBody){
        String result = null, aesKey = null, aesIv = null, compId = null, userNo = null;
        String title = null, sopp = null, customer = null, readable = null, appDoc = null, dept = null, formId = null;
        String[] files = null, ts = null;
        String[][] appLine = null;
        HttpSession session = null;
        HashMap<String, String> attached = null;
        String data = null, lang = null;
        Msg msg = null;
        JSONObject json = null;
        JSONArray jarr = null, tj = null;
        int docNo = -1, x = -1;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        userNo = (String) session.getAttribute("userNo");
        lang = (String)session.getAttribute("lang");
        msg = getMsg(lang);
        compId = (String) session.getAttribute("compId");
        attached = (HashMap<String, String>)session.getAttribute("attached");
        if(compId == null)
            compId = (String) request.getAttribute("compId");

        if(compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else
            data = decAes(requestBody, aesKey, aesIv);
            if(data == null) {
                result = "{\"result\":\"failure\",\"msg\":\"" + msg.dataIsWornFormat + "\"}";
            }else {
                json = new JSONObject(data);
                dept = json.getString("dept");
                title = json.getString("title");
                sopp = json.getString("sopp");
                readable = json.getString("readable");
                formId = json.getString("formId");
                customer = json.getString("customer");
                appDoc = json.getString("appDoc");

                // 첨부파일명에 대한 배열 전환 처리
                jarr = json.getJSONArray("attached");
                if(jarr != null && jarr.length() > 0){
                    files = new String[jarr.length()];
                    for(x = 0 ; x < jarr.length() ; x++)    files[x] = jarr.getString(x);
                }

                // 결재선에 대한 2차원 배열 전환 처리
                jarr = json.getJSONArray("appLine");
                if(jarr != null && jarr.length() > 0){
                    appLine = new String[jarr.length()][];
                    for(x = 0 ; x < jarr.length() ; x++){
                        tj = jarr.getJSONArray(x);
                        ts = new String[2];
                        ts[0] = tj.getInt(0)+"";
                        ts[1] = tj.getInt(1)+"";
                        appLine[x] = ts;
                    }
                }

                // 결재문서 처리 서비스로직으로 데이터 전달
                docNo = gwService.addAppDoc(compId, dept, title, userNo, sopp, customer, formId, readable, appDoc, files, attached, appLine);

                result = "{\"result\":\"ok\",\"data\":\"" + docNo + "\"}";
            }
        return result;
    } // End of apiGwAppDocNoPost()


    // 결재 처리 요청
    @PostMapping("/app/proceed/{docNo}/{ordered:\\d+}/{apptype:\\d+}")
    public String apiGwAppProceedPost(HttpServletRequest request, @PathVariable("docNo") String docNo, @PathVariable("ordered") int ordered, @PathVariable("apptype") int appType){
        String result = null, compId = null, userNo = null, data = null, aesIv = null, aesKey = null, lang = null;
        HttpSession session = null;
        Msg msg = null;

        session = request.getSession();
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        userNo = (String)session.getAttribute("userNo");
        lang = (String)session.getAttribute("lang");
        msg = getMsg(lang);
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            data = "";
            if(data == null)    result = "{\"result\":\"failure\",\"msg\":\"" + msg.unknownError + "\"}";
            else{
                data = encAes(data, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
            }
            
        }
        return result;
    } // End of apiGwAppCancelNoPost()


    // 결재 문서 수정 등록
    @PutMapping("/app/doc/{docNo:\\d+}")
    public String apiGwAppDocNoPut(HttpServletRequest request){
        String result = null;

        return result;
    } // End of apiGwAppDocNoPut()

    
}

