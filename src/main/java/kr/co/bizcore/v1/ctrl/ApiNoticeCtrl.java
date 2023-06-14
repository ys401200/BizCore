package kr.co.bizcore.v1.ctrl;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import kr.co.bizcore.v1.domain.Notice;
import kr.co.bizcore.v1.domain.SimpleNotice;
import kr.co.bizcore.v1.msg.Msg;
import kr.co.bizcore.v1.svc.NoticeSvc;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("api/notice")
@Slf4j
public class ApiNoticeCtrl extends Ctrl {

    private static final Logger logger = LoggerFactory.getLogger(ApiNoticeCtrl.class);

    @Autowired
    private NoticeSvc noticeSvc;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public String getAll(HttpServletRequest request) {
        String result = null, data = null, aesKey = null, aesIv = null, userNo = null, compId = null;
        int compNo = 0;
        HttpSession session = null;
        Msg msg = null;
        List<SimpleNotice> list = null;
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
            list = noticeSvc.getPostList(compNo);
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
            data = noticeSvc.encAes(data, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";            
        }

        return result;
    } // End of /api/notice === get

    @RequestMapping(value = "/{start:\\d+}/{end:\\d+}", method = RequestMethod.GET)
    public String get(HttpServletRequest request, @PathVariable("start") int start, @PathVariable("end") int end) {
        String result = null, data = null, aesKey = null, aesIv = null, userNo = null, compId = null;
        HttpSession session = null;
        Msg msg = null;
        List<SimpleNotice> list = null;
        int i = 0, count = -9999;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        compId = (String) session.getAttribute("compId");
        userNo = (String) session.getAttribute("userNo");
        msg = getMsg((String) session.getAttribute("lang"));
        if (compId == null)
            compId = (String) request.getAttribute("compId");

            
        if (compId == null) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            list = noticeSvc.getPostList(compId, start, end);
            count = noticeSvc.getCountt(compId);
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
            data = noticeSvc.encAes(data, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + data + "\",\"count\":" + count + ",\"start\":" + start + ",\"end\":" + end + "}";
        }

        return result;
    } // End of /api/notice === get

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
                num = noticeSvc.delete(compNo, no); // 삭제(update) 카운트를 실제 삭제 여부를 확인함
                if (num > 0) { // 처리됨
                    result = "{\"result\":\"ok\"}";
                } else { // 처리 안됨
                    result = "{\"result\":\" failure\",\"msg\":\"Error occured when delete.\"}";
                } // End of if : 3
            } // End of if : 2
        } // End of if : 1
        return result;
    } // End of /api/notice/* === delete

    @RequestMapping(value = "/{no}", method = RequestMethod.GET)
    public String getDetail(HttpServletRequest req, @PathVariable String no) {
        HttpSession session = null;
        String compId = null;
        int compNo = 0;
        String result = null;
        String userNo = null;
        Notice notice = null;
        String data = null;
        String aesKey, aesIv = null;


        if (no == null) { // 글 번호 확인 안됨
            result = "{\"result\":\"failure\",\"msg\":\"notiNo is not exist\"}";
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
                notice = noticeSvc.getNotice(compNo, no); // 삭제(update) 카운트를 실제 삭제 여부를 확인함

                if (notice != null) { // 처리됨
                    data = notice.toJson();
                    data = userService.encAes(data, aesKey, aesIv);
                    result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
                    
                } else { // 처리 안됨
                    result = "{\"result\":\"failure\",\"msg\":\"Error occured when read.\"}";
                } // End of if : 3
            } // End of if : 2
        } // End of if : 1
        return result;
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public String insert(HttpServletRequest req, @RequestBody String requestBody) {

        String compId = null;
        int compNo = 0;
        String userNo = null;
        String noticeTitle = null;
        String noticeContents = null;
        HttpSession session = null;
        String result = null;
        String data = null, aesKey = null, aesIv = null;
        JSONObject json = null;
        int check = 0;

        session = req.getSession();

        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        compNo = (int) session.getAttribute("compNo");
        data = noticeSvc.decAes(requestBody, aesKey, aesIv);
        json = new JSONObject(data);

        compId = (String) session.getAttribute("compId");
        if (compId == null)
            compId = (String) req.getAttribute("compId");

        userNo = (String) session.getAttribute("userNo");
        if (userNo == null)
            userNo = (String) req.getAttribute("userNo");

        noticeTitle = json.getString("noticeTitle");
        if (noticeTitle == null)
            result = "{\"result\":\" failure\" ,\"msg\":\"Title is not entered.\"}";

        noticeContents = json.getString("noticeContents");
        if (noticeContents == null)
            result = "{\"result\":\" failure\" ,\"msg\":\"Content is not entered.\"}";
        check = noticeSvc.insertNotice(compNo, userNo, noticeTitle, noticeContents);

        if (check > 0) {// 공지사항 추가 성공
            result = "{\"result\":\"ok\"}";
        } else { // 공지사항 추가 실패
            result = "{\"result\":\"failure\" ,\"msg\":\"Error occured when write.\"}";
        }

        return result;

    }

    /**
     * @param req
     * @param data
     * @return
     */
    @RequestMapping(value = "/{no}", method = RequestMethod.PUT)
    public String update(HttpServletRequest req, @RequestBody String requestBody, @PathVariable String no) {
        String noticeTitle = null;
        String noticeContents = null;
        String compId = null;
        int compNo = 0;
        String result = null;
        HttpSession session = null;
        String data = null, aesKey = null, aesIv = null;
        JSONObject json = null;

        session = req.getSession();
        compNo = (int) session.getAttribute("compNo");
        compId = (String) session.getAttribute("compId");
        if (compId == null) {
            compId = (String) req.getAttribute("compId");
        }

        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        data = noticeSvc.decAes(requestBody, aesKey, aesIv);
        json = new JSONObject(data);

        if (no == null)
            result = "{\"result\":\"failure\",\"msg\":\"notiNo is not exist\"}";

        if (json.getString("noticeTitle") != null)
            noticeTitle = json.getString("noticeTitle");
        else
            result = "{\"result\":\"failure\",\"msg\":\"title is not exist\"}";

        if (json.getString("noticeContents") != null)
            noticeContents = json.getString("noticeContents");
        else
            result = "{\"result\":\"failure\",\"msg\":\"content is not exist\"}";

        if (noticeSvc.updateNotice(noticeTitle, noticeContents, compNo, no) > 0) {
            result = "{\"result\":\"ok\"}";
        }

        return result;

    }

} // End of Class
