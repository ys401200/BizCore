package kr.co.bizcore.v1.ctrl;

import java.util.Date;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import kr.co.bizcore.v1.domain.Schedule;
import kr.co.bizcore.v1.domain.Sopp;
import kr.co.bizcore.v1.domain.TradeDetail;
import kr.co.bizcore.v1.msg.Msg;
import kr.co.bizcore.v1.svc.SoppService;
import kr.co.bizcore.v1.svc.SystemService;
import kr.co.bizcore.v1.svc.TestService;
import kr.co.bizcore.v1.svc.TradeService;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/system")
@Slf4j
public class SystemCtrl extends Ctrl {

    private static final Logger logger = LoggerFactory.getLogger(SystemCtrl.class);

    @Autowired
    private SoppService svc;

    @Autowired
    private TestService tsvc;

    @Autowired
    private SystemService systemService;

    @RequestMapping(value = "/connUrl", method = RequestMethod.GET)
    public String connUrl() {
        return systemService.getConnUrl();
    } // End of connUrl()

    @GetMapping("/test/{no}")
    public String test(@PathVariable String no) {
        String result = null;

        Sopp e1 = null, e2 = null;
        // e1 = svc.getSopp(no, "vtek");
        // e2 = svc.getSopp(10005598 + "", "vtek");

        // result = e1.createInsertQuery(null, null);
        if (e1 == null)
            result = "null";
        else {
            result = e1.createInsertQuery(null, "vtek");
            result = "result" + svc.executeSqlQuery(result);
        }

        return result;
    } // End of test()

    @GetMapping("/test/file")
    public String file() {
        tsvc.dbToStorageGwFile();
        return "00000";
    } // End of test()

    @GetMapping("/doc")
    public String getDocList(HttpServletRequest request, HttpServletResponse response) {
        String result = null;

        response.setContentType("application/json;charset=utf-8");

        result = tsvc.docList();

        if (result == null)
            result = "{\"result\":\"failure\",\"msg\":\"Data is null.\"}";
        else
            result = "{\"result\":\"ok\",\"data\":" + result + "}";

        return result;
    }

    @GetMapping("/doc/{docNo}")
    public String getDocData(HttpServletRequest request, HttpServletResponse response, @PathVariable String docNo) {
        String result = null, data1 = null, data2 = null, data3 = null;

        response.setContentType("application/json;charset=utf-8");

        data1 = tsvc.docFile(docNo);
        data2 = tsvc.docData(docNo);
        data3 = tsvc.docApp(docNo);

        result = "{\"result\":\"ok\",\"files\":" + (data1 == null ? "null" : data1) + ",\"docData\":"
                + (data2 == null ? "null" : data2) + ",\"appData\":" + (data3 == null ? "null" : data3) + "}";

        return result;
    }

    @GetMapping("/schedule/{docNo}")
    public String getScheduleData(HttpServletRequest request, HttpServletResponse response,
            @PathVariable String docNo) {
        String result = null, data = null;
        Schedule sch = null, sch2 = null;

        response.setContentType("application/json;charset=utf-8");
        sch = scheduleSvc.getSchedule("vtek", "schedule", docNo);
        sch2 = scheduleSvc.getSchedule("vtek", "schedule", "10064972");

        logger.info("[TEST] :::::::::::::::::::::::::: schedule 1 : " + sch.toJson());
        logger.info("[TEST] :::::::::::::::::::::::::: schedule 2 : " + sch.toJson());

        result = "{\"result\":\"ok\",\"data\":"
                + (sch == null ? "null" : "\"" + sch.createUpdateQuery(sch2, null) + "\"") + "}";

        return result;
    }

    @GetMapping("/sopp/file")
    public String saveSoppFile(HttpServletRequest request) {
        String result = null;
        int count = -1;

        count = systemService.soppFileDownloadAndSave();
        result = "{\"count\":" + count + "}";

        return result;
    }

    @PostMapping("/doc") // 기존 문서 기본 정보 insert
    public String convertReport(HttpServletRequest request, @RequestBody String requestBody) {
        String result = null, aesKey = null, aesIv = null, userNo = null;
        String compId = null, docNo = null, formId = null, dept = null, docBox = null;
        String title = null, confirmNo = null, readable = null, created;
        HttpSession session = null;
        String data = null, lang = null;
        int writer, status = 0;
        Msg msg = null;
        JSONObject json = null;
        int serviceAnswer = 0;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        userNo = (String) session.getAttribute("userNo");
        lang = (String) session.getAttribute("lang");
        msg = getMsg(lang);
        compId = (String) session.getAttribute("compId");
        if (compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        } else if (aesKey == null || aesIv == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        } else

            data = decAes(requestBody, aesKey, aesIv);
        logger.info(data + "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");

        if (data == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.dataIsWornFormat + "\"}";
        } else {
            json = new JSONObject(data);
            docNo = json.getString("docNo");
            writer = json.getInt("writer");
            formId = json.getString("formId");
            dept = json.getString("dept");
            docBox = json.getString("docBox");
            confirmNo = json.getString("confirmNo");
            status = json.getInt("status");
            readable = json.getString("readable");
            created = json.getString("created");
            title = json.getString("title");
            serviceAnswer = systemService.insertReport(docNo, writer, formId, dept, docBox, title, confirmNo, status,
                    readable, created);
            if (serviceAnswer == 1) {
                result = "{\"result\":\"ok\"}";
            } else {
                result = "{\"result\":\"failure\"}";
            }

        }
        return result;
    }

    @PostMapping("/doc/oridetail") // 기존 문서 기본 정보 insert
    public String convertReportDetail(HttpServletRequest request, @RequestBody String requestBody) {

        String compId, docNo, read, doc, approved, retrieved, rejected, comment, appData;
        int ordered, employee, appType, isModify;
        HttpSession session = null;
        String data = null, lang = null;
        String aesKey, aesIv, userNo;
        Msg msg = null;
        JSONObject json = null;
        int serviceAnswer = 0;
        String result = null;
        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        userNo = (String) session.getAttribute("userNo");
        lang = (String) session.getAttribute("lang");
        msg = getMsg(lang);
        compId = (String) session.getAttribute("compId");
        if (compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        } else if (aesKey == null || aesIv == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        } else

            data = decAes(requestBody, aesKey, aesIv);

        if (data == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.dataIsWornFormat + "\"}";
        } else {
            json = new JSONObject(data);
            docNo = json.getString("docNo");
            ordered = json.getInt("ordered");
            employee = json.getInt("employee");
            appType = json.getInt("appType");
            read = json.isNull("read") ? null : json.getString("read");
            isModify = json.getInt("isModify");
            doc = json.isNull("doc") ? null : json.getString("doc");
            approved = json.isNull("approved") ? null : json.getString("approved");
            rejected = json.isNull("rejected") ? null : json.getString("rejected");
            retrieved = json.isNull("retrieved") ? null : json.getString("retrieved");
            comment = json.isNull("comment") ? null : json.getString("comment");
            appData = json.isNull("appData") ? null : json.getString("appData");

            serviceAnswer = systemService.insertReportDetail(docNo, ordered, employee, appType, read, isModify,
                    doc, approved, retrieved, rejected, comment, appData);
            if (serviceAnswer == 1) {
                result = "{\"result\":\"ok\"}";
            } else {
                result = "{\"result\":\"failure\"}";
            }

        }
        return result;
    }

    @GetMapping("/doc/attachedFile/{docNo}") // 기존 문서 기본 정보 insert
    public String convertFile(HttpServletRequest request, HttpServletResponse response,
            @PathVariable String docNo) {
        String result =null;
        int serviceAnswer =0;
        serviceAnswer = systemService.docFileDownloadAndSave(docNo);
        logger.info("controller chk" + serviceAnswer);
        if (serviceAnswer > 1) {
            result = "ok";
            // result = "{\"result\":\"ok\"}";
        }else if (serviceAnswer == 0) {
            result = "no file";
            // result = "{\"result\":\"ok\"}";
        } else {
            result = "failure";
            // result = "{\"result\":\"failure\"}";
        }
        return result;
    }

    @GetMapping("/estimate") // 견적 컨버팅 / 기존 견적 정보 불러오기
    public String getEstimateInfo(HttpServletRequest request) {
        String result =null, data = null;
        
        data = tsvc.getEstmInfo();


        return result;
    }

    @GetMapping(value = {"/pathtest/{n1}/{v1}","/pathtest/{n1}/{v1}/{n2}/{v2}","/pathtest/{n1}/{v1}/{n2}/{v2}/{n3}/{v3}"})
    public String pathTest(@PathVariable(required = false) String n1, @PathVariable(required = false) String v1, @PathVariable(required = false) String n2, @PathVariable(required = false) String v2, @PathVariable(required = false) String n3, @PathVariable(required = false) String v3){
        String result = "";

        if(n1 != null)  result += (n1 + " / ");
        if(v1 != null)  result += (v1 + " / ");
        if(n2 != null)  result += (n2 + " / ");
        if(v2 != null)  result += (v2 + " / ");
        if(n3 != null)  result += (n3 + " / ");
        if(v3 != null)  result += (v3 + " / ");

        return result;
    }

    @GetMapping("/procure")
    public String procure(){

        return testService.convertProcure();
    }
}
