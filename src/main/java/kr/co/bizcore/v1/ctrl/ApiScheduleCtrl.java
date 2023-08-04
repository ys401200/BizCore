package kr.co.bizcore.v1.ctrl;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.bizcore.v1.domain.Sales;
import kr.co.bizcore.v1.domain.Schedule;
import kr.co.bizcore.v1.domain.Tech;
import kr.co.bizcore.v1.msg.Msg;
import lombok.extern.slf4j.Slf4j;

@RequestMapping("/api/schedule")
@RestController
@Slf4j
public class ApiScheduleCtrl extends Ctrl {
    private static final Logger logger = LoggerFactory.getLogger(AccountingController.class);

    @RequestMapping(value = "/calendar", method = RequestMethod.GET)
    public String getAll(HttpServletRequest request) {
        String result = null, data = null, aesKey = null, aesIv = null, userNo = null, compId = null;
        int compNo = 0;
        HttpSession session = null;
        Msg msg = null;
        List<Schedule> list = null;
        int i = 0;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        compId = (String) session.getAttribute("compId");
        compNo = (int) session.getAttribute("compNo");
        userNo = (String) session.getAttribute("userNo");
        msg = getMsg((String) session.getAttribute("lang"));
        if (compId == null)
            compId = (String) request.getAttribute("compId");

        if (compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            String searchUserNo = request.getParameter("userNo");
            String searchSoppNo = request.getParameter("soppNo");
            String searchCustNo = request.getParameter("custNo");
            String searchType = request.getParameter("type");
            String regDatetimeFrom = request.getParameter("regDatetimeFrom");
            String regDatetimeTo = request.getParameter("regDatetimeTo");

            if(searchUserNo != null || searchSoppNo != null || searchCustNo != null || searchType != null || regDatetimeFrom != null || regDatetimeTo != null){
                list = scheduleService.getSearchList(compNo, searchUserNo, searchSoppNo, searchCustNo, searchType, regDatetimeFrom, regDatetimeTo);
            }else{
                list = scheduleService.getList(compNo);
            }

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
            data = scheduleService.encAes(data, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";            
        }

        return result;
    }

    @RequestMapping(value = "/{no}", method = RequestMethod.GET)
    public String getScheduleOne(HttpServletRequest request, @PathVariable String no) {
        HttpSession session = null;
        String compId = null;
        int compNo = 0;
        String result = null;
        String userNo = null;
        Schedule schedule = null;
        String data = null;
        String aesKey, aesIv = null;

        if (no == null) { // 글 번호 확인 안됨
            result = "{\"result\":\"failure\",\"msg\":\"salesNo is not exist\"}";
        } else { // 글 번호 확인 됨
            session = request.getSession();
            compId = (String) session.getAttribute("compId");
            compNo = (int) session.getAttribute("compNo");
            aesKey = (String) session.getAttribute("aesKey");
            aesIv = (String) session.getAttribute("aesIv");
            if (compId == null)
                compId = (String) request.getAttribute("compId");
            userNo = (String) session.getAttribute("userNo");

            if (compId == null) { // 회사코드 확인 안됨
                result = "{\"result\":\"failure\",\"msg\":\"Company ID is not verified.\"}";
            } else if (userNo == null) {
                result = "{\"result\":\"failure\",\"msg\":\"Session expired and/or Not logged in.\"}";
            } else { // 회사코드 확인 됨
                schedule = scheduleService.getScheduleOne(compNo, no); // 삭제(update) 카운트를 실제 삭제 여부를 확인함

                if (schedule != null) { // 처리됨
                    data = schedule.toJson();
                    data = scheduleService.encAes(data, aesKey, aesIv);
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
        data = salesService.decAes(requestBody, aesKey, aesIv);
        Schedule schedule = mapper.readValue(data, Schedule.class);
        schedule.setCompNo(compNo);

        check = scheduleService.insertSchedule(schedule);

        if (check > 0) {
            result = "{\"result\":\"ok\"}";
        } else {
            result = "{\"result\":\"failure\" ,\"msg\":\"Error occured when write.\"}";
        }

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
        data = salesService.decAes(requestBody, aesKey, aesIv);
        Schedule schedule = mapper.readValue(data, Schedule.class);
        schedule.setCompNo(compNo);

        if (scheduleService.updateSchedule(schedule) > 0) {
            result = "{\"result\":\"ok\"}";
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
                num = scheduleService.delete(compNo, no); // 삭제(update) 카운트를 실제 삭제 여부를 확인함
                if (num > 0) { // 처리됨
                    result = "{\"result\":\"ok\"}";
                } else { // 처리 안됨
                    result = "{\"result\":\" failure\",\"msg\":\"Error occured when delete.\"}";
                } // End of if : 3
            } // End of if : 2
        } // End of if : 1
        return result;
    }

    @RequestMapping(value = "/workReport", method = RequestMethod.GET)
    public String getWorkReport(HttpServletRequest request) {
        String result = null, data = null, aesKey = null, aesIv = null, userNo = null, compId = null;
        int compNo = 0;
        HttpSession session = null;
        Msg msg = null;
        List<Schedule> list = null;
        int i = 0;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        compId = (String) session.getAttribute("compId");
        compNo = (int) session.getAttribute("compNo");
        userNo = (String) session.getAttribute("userNo");
        msg = getMsg((String) session.getAttribute("lang"));
        if (compId == null)
            compId = (String) request.getAttribute("compId");

        if (compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            String setDate = request.getParameter("setDate");
            list = scheduleService.getWorkReport(setDate, compNo);

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
            data = scheduleService.encAes(data, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";            
        }

        return result;
    }

    @RequestMapping(value = "/sreport", method = RequestMethod.GET)
    public String getSreport(HttpServletRequest request) {
        String result = null, data = null, aesKey = null, aesIv = null, userNo = null, compId = null;
        int compNo = 0;
        HttpSession session = null;
        Msg msg = null;
        Schedule schedule = null;
        int i = 0;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        compId = (String) session.getAttribute("compId");
        compNo = (int) session.getAttribute("compNo");
        userNo = (String) session.getAttribute("userNo");
        msg = getMsg((String) session.getAttribute("lang"));
        if (compId == null)
            compId = (String) request.getAttribute("compId");

        if (compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            String weekNum = request.getParameter("weekNum");
            schedule = scheduleService.getSreport(weekNum, userNo, compNo);

            if (schedule != null) {
                data = schedule.toJson();
                data = scheduleService.encAes(data, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
                
            } else { // 처리 안됨
                result = "{\"result\":\"failure\",\"msg\":\"Error occured when read.\"}";
            } // End of if : 3
        }

        return result;
    }

    @RequestMapping(value = "/reportUpdate/{no}/{type}", method = RequestMethod.PUT)
    public String reportUpdate(HttpServletRequest req, @RequestBody String requestBody, @PathVariable String no, @PathVariable String type) throws JsonMappingException, JsonProcessingException {
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
        data = scheduleService.decAes(requestBody, aesKey, aesIv);

        if(type.equals("sales")){
            Sales sales = mapper.readValue(data, Sales.class);
            sales.setCompNo(compNo);

            if (scheduleService.salesReportUpdate(sales) > 0) {
                result = "{\"result\":\"ok\"}";
            }
        }else if(type.equals("schedule")){
            Schedule schedule = mapper.readValue(data, Schedule.class);
            schedule.setCompNo(compNo);

            if (scheduleService.scheduleReportUpdate(schedule) > 0) {
                result = "{\"result\":\"ok\"}";
            }
        }else{
            Tech tech = mapper.readValue(data, Tech.class);
            tech.setCompNo(compNo);

            if (scheduleService.techReportUpdate(tech) > 0) {
                result = "{\"result\":\"ok\"}";
            }
        }

        return result;
    }

    @RequestMapping(value = "/reportOtherInsert", method = RequestMethod.POST)
    public String reportOtherInsert(HttpServletRequest req, @RequestBody String requestBody) throws JsonMappingException, JsonProcessingException {

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
        data = salesService.decAes(requestBody, aesKey, aesIv);
        Schedule schedule = mapper.readValue(data, Schedule.class);
        schedule.setCompNo(compNo);

        check = scheduleService.reportOtherInsert(schedule);

        if (check > 0) {
            result = "{\"result\":\"ok\"}";
        } else {
            result = "{\"result\":\"failure\" ,\"msg\":\"Error occured when write.\"}";
        }

        return result;
    }

    // ============================== 캘린더 ============================================= / 기간은 기본적으로 월단위

    // 캘린더 정보 요청에 대한 처리 / 연월 정보 없음 / 현재 연월
    // @GetMapping("/calendar/{scope}")
    // public String apiScheduleCalendar(HttpServletRequest request, @PathVariable("scope") String scope){
    //     String result = null;
    //     int yy = 0, mm = 0;
    //     Calendar cal = Calendar.getInstance();
        
    //     if(scope != null && (scope.equals("company") || scope.equals("dept") || scope.equals("personal"))){
    //         yy = cal.get(Calendar.YEAR);
    //         mm = cal.get(Calendar.MONTH) + 1;
    //         result = apiScheduleCalendar(request, scope, yy, mm);
    //     }else{
    //         result = "{\"result\":\"failure\",\"msg\":\"Requested scope wrong or not exist.\"}";
    //     }
        
    //     return result;
    // } // End of apiScheduleCalendar()

    // 캘린더 정보 요청에 대한 처리 / 요청 연월에 대한 처리
    // @GetMapping("/calendar/{scope:\\D+}/{year:\\d+}/{month:\\d+}")
    // public String apiScheduleCalendar(HttpServletRequest request, @PathVariable("scope") String scope, @PathVariable("year") int year, @PathVariable("month") int month){
    //     String result = null;
    //     String compId = null, aesKey = null, aesIv = null, data = null, userNo = null;
    //     int maxYear = 0, minYear = 0;
    //     Calendar cal = Calendar.getInstance();
    //     HttpSession session = null;
    //     SimpleUser user = null;

    //     minYear = cal.get(Calendar.YEAR) - 5;
    //     maxYear = cal.get(Calendar.YEAR) + 1;
    //     session = request.getSession();
    //     aesKey = (String)session.getAttribute("aesKey");
    //     aesIv = (String)session.getAttribute("aesIv");
    //     compId = (String)session.getAttribute("compId");
    //     userNo = (String)session.getAttribute("userNo");
    //     if(compId == null)  compId = (String)request.getAttribute("compId");

    //     user = userService.getUserMap(compId).get(userNo);

    //     if(compId == null){
    //         result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
    //     }else if(scope == null || !(scope.equals("company") || scope.equals("dept") || scope.equals("personal"))){
    //         result = "{\"result\":\"failure\",\"msg\":\"Requested scope wrong or not exist.\"}";
    //     }else if(aesKey == null || aesIv == null){
    //         result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
    //     }else if(year < minYear || year > maxYear){
    //         result = "{\"result\":\"failure\",\"msg\":\"Date Exceeded.\"}";
    //     }else{
    //         data = scheduleSvc.getScheduleListForCalendar(compId, scope, user.getDeptIdSqlIn(), userNo, year, month);
    //         if(data != null){
    //             data = userService.encAes(data, aesKey, aesIv);
    //             result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
    //         }else{
    //             result = "{\"result\":\"failure\",\"msg\":\"Error occured.\"}";
    //         }
    //     }
    //     return result;
    // } // End of apiScheduleCalendar()

    // =========================================== 일정 Detail / 신규, 수정, 삭제, 조회 ====================================

    // 단일 일정에 대한 조회 요청
    // @GetMapping("/{type:\\D+}/{no:\\d+}")
    // public String apiScheduleTypeNoGet(HttpServletRequest request, @PathVariable String type, @PathVariable int no){
    //     String result = null;
    //     String compId = null, aesKey = null, aesIv = null;
    //     Schedule data = null;
    //     HttpSession session = null;

    //     session = request.getSession();
    //     aesKey = (String)session.getAttribute("aesKey");
    //     aesIv = (String)session.getAttribute("aesIv");
    //     compId = (String)session.getAttribute("compId");
    //     if(compId == null)  compId = (String)request.getAttribute("compId");

    //     if(compId == null){
    //         result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
    //     }else if(aesKey == null || aesIv == null){
    //         result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
    //     }else{
    //         data = scheduleSvc.getSchedule(compId, type, no + "");
    //         if(data != null){
    //             result = encAes(data.toJson(), aesKey, aesIv);
    //             result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
    //         }else{
    //             result = "{\"result\":\"failure\",\"msg\":\"Error occured.\"}";
    //         }
    //     }

    //     return result;
    // }

    // // 단일 일정에 대한 신규  요청
    // @PostMapping("{type:\\D+}")
    // public String apiScheduleTypePost(HttpServletRequest request, @RequestBody String requestBody, @PathVariable String type){
    //     String result = null;
    //     String compId = null;
    //     String aesKey = null;
    //     String aesIv = null;
    //     String json = null;
    //     ObjectMapper mapper = null;
    //     Schedule schedule = null;
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
    //         json = salesService.decAes(requestBody, aesKey, aesIv);
    //         try {
    //             schedule = mapper.readValue(json, Schedule.class);
    //             if(scheduleSvc.addSchedule(compId, schedule) > 0)   result = "{\"result\":\"ok\"}";
    //             else                                                    result = "{\"result\":\"failure\",\"msg\":\"An error occurred.\"}";
    //         } catch (Exception e) {
    //             result = "{\"result\":\"failure\",\"msg\":\"Data is wrong.\"}";
    //         }
    //     }
    //     return result;
    // }

    // // 단일 일정에 대한 수정 요청
    // @PutMapping("/{type:\\D+}/{no:\\d+}")
    // public String apiScheduleTypeNoPut(HttpServletRequest request, @RequestBody String requestBody, @PathVariable String type, @PathVariable int no){
    //     String result = null;
    //     String compId = null;
    //     String aesKey = null;
    //     String aesIv = null;
    //     String json = null;
    //     ObjectMapper mapper = null;
    //     Schedule3 schedule = null;
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
    //         json = salesService.decAes(requestBody, aesKey, aesIv);
    //         try {
    //             schedule = mapper.readValue(json, Schedule3.class);
    //             schedule.setNo(no);
    //             if(scheduleSvc.modifySchedule(compId, schedule) > 0)    result = "{\"result\":\"ok\"}";
    //             else                                                        result = "{\"result\":\"failure\",\"msg\":\"An error occurred.\"}";
    //         } catch (Exception e) {
    //             e.printStackTrace();
    //             result = "{\"result\":\"failure\",\"msg\":\"Data is wrong.\"}";
    //         }
    //     }
    //     return result;
    // }

    // // 단일 일정에 대한 삭제 요청
    // @DeleteMapping("/{type:\\D+}/{no:\\d+}")
    // public String apiScheduleTypeNoDelete(HttpServletRequest request, @PathVariable String type, @PathVariable int no){
    //     String result = null;
    //     String compId = null;
    //     int count = -1;
    //     HttpSession session = null;

    //     session = request.getSession();
    //     compId = (String)session.getAttribute("compId");
    //     if(compId == null)  compId = (String)request.getAttribute("compId");

    //     if(compId == null){
    //         result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
    //     }else{
    //         if(type.equals("sales") || type.equals("tech") || type.equals("schedule")){
    //             count = scheduleSvc.deleteSchedule(compId, type, no + "");
    //             if(count > 0)   result = "{\"result\":\"ok\"}";
    //             else            result = "{\"result\":\"failure\",\"msg\":\"Error occured.\"}";
    //         }else   result = "{\"result\":\"failure\",\"msg\":\"Schedule type mismatch..\"}";
    //     }
    //     return result;
    // }

    // // ============================== 업무보고 ============================================= / 기간은 기본적으로 주단위

    // @GetMapping("/workreport")
    // public String apiScheduleReport(HttpServletRequest request){
    //     int date = getCurrentDate();
    //     return apiScheduleReportDeptDate(request, date);
    // }

    // @GetMapping("/workreport/company")
    // public String apiScheduleReportCompany(HttpServletRequest request){
    //     int date = getCurrentDate();
    //     return apiScheduleReportCompanyDate(request, date);
    // }

    // @GetMapping("/workreport/company/{date:\\d+}")
    // public String apiScheduleReportCompanyDate(HttpServletRequest request, @PathVariable("date") int date){
    //     return getWorkReport(request, "company", date);
    // }

    // @GetMapping("/workreport/dept")
    // public String apiScheduleReportDept(HttpServletRequest request){
    //     int date = getCurrentDate();
    //     return apiScheduleReportDeptDate(request, date);
    // }

    // @GetMapping("/workreport/dept/{date:\\d+}")
    // public String apiScheduleReportDeptDate(HttpServletRequest request, @PathVariable("date") int date){
    //     return getWorkReport(request, "dept", date);
    // }

    // @GetMapping("/workreport/personal")
    // public String apiScheduleReportPersonal(HttpServletRequest request){
    //     int date = getCurrentDate();
    //     return apiScheduleReportPersonalDate(request, date);
    // }

    // @GetMapping("/workreport/personal/{date:\\d+}")
    // public String apiScheduleReportPersonalDate(HttpServletRequest request, @PathVariable("date") int date){
    //     return getWorkReport(request, "personal", date);
    // }

    // private String getWorkReport(HttpServletRequest request, String scope, int date){
    //     String result = null;
    //     String compId = null, aesKey = null, aesIv = null, userNo = null, data = null;
    //     HttpSession session = null;
    //     SimpleUser user = null;

    //     session = request.getSession();
    //     aesKey = (String)session.getAttribute("aesKey");
    //     aesIv = (String)session.getAttribute("aesIv");
    //     userNo = (String)session.getAttribute("userNo");
    //     compId = (String)session.getAttribute("compId");
    //     if(compId == null)  compId = (String)request.getAttribute("compId");

    //     user = userService.getUserMap(compId).get(userNo);

    //     if(compId == null){
    //         result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
    //     }else if(aesKey == null || aesIv == null){
    //         result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
    //     }else{
    //         data = scheduleSvc.getWorkReport(compId, scope, date, user);
    //         if(data == null){
    //             result = "{\"result\":\"failure\",\"msg\":\"Error occured.\"}";
    //         }else{
    //             data = encAes(data, aesKey, aesIv);
    //             result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
    //         }
    //     }

    //     return result;
    // }

    // @PostMapping("/workreport/personal/{date:\\d+}")
    // public String apiWorkreportPersonalDatePost(HttpServletRequest request, @PathVariable("date") int date, @RequestBody String requestBody){
    //     String result = null;
    //     String compId = null, aesKey = null, aesIv = null, userNo = null, data = null, previousWeek = null, currentWeek = null;
    //     boolean previousWeekCheck = false, currentWeekCheck = false;
    //     HttpSession session = null;
    //     JSONObject json = null, schedule = null;;
    //     JSONArray jarr = null;
    //     String[] item = null;
    //     ArrayList<String[]> checked = new ArrayList<>();
    //     int x = 0;

    //     session = request.getSession();
    //     aesKey = (String)session.getAttribute("aesKey");
    //     aesIv = (String)session.getAttribute("aesIv");
    //     userNo = (String)session.getAttribute("userNo");
    //     compId = (String)session.getAttribute("compId");
    //     if(compId == null)  compId = (String)request.getAttribute("compId");

    //     if(compId == null){
    //         result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
    //     }else if(aesKey == null || aesIv == null){
    //         result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
    //     }else{
    //         data = decAes(requestBody, aesKey, aesIv);
    //         json = new JSONObject(data);
    //         currentWeek = json.getString("currentWeek");
    //         previousWeek = json.getString("previousWeek");
    //         currentWeekCheck = json.getBoolean("currentWeekCheck");
    //         previousWeekCheck = json.getBoolean("previousWeekCheck");

    //         jarr = json.getJSONArray("schedule");
    //         if(jarr != null)    for(x = 0 ; x < jarr.length() ; x++){
    //             schedule = jarr.getJSONObject(x);
    //             item = new String[3];
    //             item[0] = schedule.getString("job");
    //             item[1] = schedule.getString("no");
    //             item[2] = schedule.getBoolean("report") ? "1" : "0";
    //             checked.add(item);
    //         }

    //         if(scheduleSvc.addWorkReport(compId, userNo, date, previousWeek, previousWeekCheck, currentWeek, currentWeekCheck, checked)){
    //             result = "{\"result\":\"ok\"}";
    //         }else{
    //             result = "{\"result\":\"failure\",\"msg\":\"Error occured.\"}";
    //         }
    //     }

    //     return result;
    // }

    // @DeleteMapping("/workreport/personal/{date:\\d+}")
    // public String apiWorkreportPersonalDateDelete(HttpServletRequest request, @PathVariable("date") int date){
    //     String result = null;
    //     HttpSession session = null;
    //     String compId = null, userNo = null;

    //     session = request.getSession();
    //     compId = (String)session.getAttribute("compId");
    //     userNo = (String)session.getAttribute("userNo");
    //     if(compId == null)  compId = (String)request.getAttribute("compId");

    //     if(compId == null){
    //         result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
    //     }else{
    //         if(scheduleSvc.deleteWorkReport(compId, userNo, date)){
    //             result = "{\"result\":\"ok\"}";
    //         }else{
    //             result = "{\"result\":\"failure\",\"msg\":\"Error occured.\"}";
    //         }
    //     }

    //     return result;
    // }

    // @GetMapping("/tech/sopp/{sopp:\\d+}/customer/{customer:\\d+}/contract/{contract:\\d+}")
    // public String apiTechDetailSchedule(HttpServletRequest request, @PathVariable("sopp") int sopp, @PathVariable("customer") int customer, @PathVariable("contract") int contract){
    //     String result = null, data = null;
    //     HttpSession session = null;
    //     String compId = null, aesKey = null, aesIv = null;

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
    //         data = scheduleSvc.getTechDetil(compId, sopp, customer, contract);
    //         if(data != null){
    //             data = encAes(data, aesKey, aesIv);
    //             result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
    //         }else{
    //             result = "{\"result\":\"failure\",\"msg\":\"Error occured.\"}";
    //         }
    //     }

    //     return result;
    // }

    // @GetMapping("/sales/sopp/{sopp:\\d+}/customer/{customer:\\d+}")
    // public String apiSalesDetailSchedule(HttpServletRequest request, @PathVariable("sopp") int sopp, @PathVariable("customer") int customer){
    //     String result = null, data = null;
    //     HttpSession session = null;
    //     String compId = null, aesKey = null, aesIv = null;

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
    //         data = scheduleSvc.getSalesDetil(compId, sopp, customer);
    //         if(data != null){
    //             data = encAes(data, aesKey, aesIv);
    //             result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
    //         }else{
    //             result = "{\"result\":\"failure\",\"msg\":\"Error occured.\"}";
    //         }
    //     }

    //     return result;
    // }

    // // ===================== P R I V A T E _ M E T H O D =========================
    // private int getCurrentDate(){
    //     int result = 0;
    //     Calendar cal = Calendar.getInstance();
    //     result += (cal.get(Calendar.YEAR) * 10000);
    //     result += ((cal.get(Calendar.MONTH) + 1) * 100);
    //     result += cal.get(Calendar.DATE);
    //     return result;
    // }    


    
}

