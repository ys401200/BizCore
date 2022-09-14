package kr.co.bizcore.v1.ctrl;

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
        String forms = null;
        int i = 0;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");

        forms = gwService.getForms();
        if (forms == null)  result = "{\"result\":\"failure\",\"msg\":\"Document forms Not Found.\"}";
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
        String form = null;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");

        form = gwService.getForm(formId);
        if (form == null)  result = "{\"result\":\"failure\",\"msg\":\"Document form Not Found.\"}";
        else{
            data = encAes(form, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
        }

        return result;
    } // End of apiGwFormGet()

    // 결재 대기 목록을 전달
    @GetMapping("/app/wait")
    public String apiGwAppWaitGet(HttpServletRequest request){
        String result = null;

        return result;
    } // End of apiGwAppWaitGet()

    // 결재 예정 목록을 전달
    @GetMapping("/app/due")
    public String apiGwAppDueGet(HttpServletRequest request){
        String result = null;

        return result;
    } // End of apiGwAppDueGet()

    // 결재 참조 목록을 전달
    @GetMapping("/app/refer")
    public String apiGwAppReferGet(HttpServletRequest request){
        String result = null;

        return result;
    } // End of apiGwAppReferGet()

    // 결재 임시 목록을 전달
    @GetMapping("/app/temp")
    public String apiGwAppTempGet(HttpServletRequest request){
        String result = null;

        return result;
    } // End of apiGwAppTempGet()

    // 결재 수신 목록을 전달
    @GetMapping("/app/receive")
    public String apiGwAppReceiveGet(HttpServletRequest request){
        String result = null;

        return result;
    } // End of apiGwAppReceiveGet()

    // 내 결재 문서 목록을 전달
    @GetMapping("/app/mydraft")
    public String apiGwAppMydraftGet(HttpServletRequest request){
        String result = null;

        return result;
    } // End of apiGwAppMydraftGet()

    // 결재 문서를 전달
    @GetMapping("/app/doc/{docNo:\\d+}")
    public String apiGwAppDocNoGet(HttpServletRequest request){
        String result = null;

        return result;
    } // End of apiGwAppDocNoGet()

    // 결재 문서 신규 등록
    @PostMapping("/app/doc")
    public String apiGwAppDocPost(HttpServletRequest request, @RequestBody String requestBody){
        String result = null, aesKey = null, aesIv = null, compId = null, userNo = null;
        String title = null, sopp = null, customer = null, readable = null, appDoc = null, dept = null;
        String[] attached = null, ts = null;
        String[][] appLine = null;
        HttpSession session = null;
        String data = null;
        JSONObject json = null;
        JSONArray jarr = null, tj = null;
        int docNo = -1, x = -1;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        userNo = (String) session.getAttribute("aesIv");
        compId = (String) session.getAttribute("compId");
        if(compId == null)
            compId = (String) request.getAttribute("compId");

        if(compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is not verified.\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
        }else
            data = decAes(requestBody, aesKey, aesIv);
            if(data == null) {
                result = "{\"result\":\"failure\",\"msg\":\"Data is wrong\"}";
            }else {
                json = new JSONObject(data);
                dept = json.getString("dept");
                title = json.getString("title");
                sopp = json.getString("sopp");
                readable = json.getString("readable");
                customer = json.getString("customer");
                appDoc = json.getString("appDoc");

                // 첨부파일명에 대한 배열 전환 처리
                jarr = json.getJSONArray("attached");
                if(jarr != null && jarr.length() > 0){
                    attached = new String[jarr.length()];
                    for(x = 0 ; x < jarr.length() ; x++)    attached[x] = jarr.getString(x);
                }

                // 결재선에 대한 2차원 배열 전환 처리
                jarr = json.getJSONArray("appLine");
                if(jarr != null && jarr.length() > 0){
                    appLine = new String[jarr.length()][];
                    for(x = 0 ; x < jarr.length() ; x++){
                        tj = jarr.getJSONArray(x);
                        ts = new String[2];
                        ts[0] = tj.getString(0);
                        ts[1] = tj.getString(1);
                        appLine[x] = ts;
                    }
                }

                // 결재문서 처리 서비스로직으로 데이터 전달
                docNo = gwService.addAppDoc(compId, dept, title, userNo, sopp, customer, readable, appDoc, attached, appLine);




                result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
            }
        return result;
    } // End of apiGwAppDocNoPost()

    // 결재 문서 수정 등록
    @PutMapping("/app/doc/{docNo:\\d+}")
    public String apiGwAppDocNoPut(HttpServletRequest request){
        String result = null;

        return result;
    } // End of apiGwAppDocNoPut()

    // 결재 문서 취소
    @PostMapping("/app/cancel/{docNo:\\d+}")
    public String apiGwAppCancelNoPost(HttpServletRequest request){
        String result = null;

        return result;
    } // End of apiGwAppCancelNoPost()

    // 결재 문서 반려
    @PostMapping("/app/return/{docNo:\\d+}")
    public String apiGwAppReturnNoPost(HttpServletRequest request){
        String result = null;

        return result;
    } // End of apiGwAppReturnNoPost()
    
}

