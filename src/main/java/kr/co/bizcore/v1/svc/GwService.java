package kr.co.bizcore.v1.svc;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.DocForm;
import kr.co.bizcore.v1.mapper.GwMapper;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class GwService extends Svc{

    private static final Logger logger = LoggerFactory.getLogger(GwService.class);

    // 양식 목록 전달
    public String getForms(){
        String result = null;
        List<DocForm> list = null;
        DocForm form = null;
        int x = 0;

        list = gwFormMapper.getFormList();
        for(x = 0 ; x < list.size() ; x++){
            if(x == 0)  result = "[";
            else        result += ",";
            result += list.get(x).toJson();
        }
        if(result != null)  result += "]";
        return result;
    }

    // 해당 아이디를 가진 양식 본문 전달
    public String getForm(String docId){
        String result = null;
        DocForm form = null;
        form = gwFormMapper.getForm(docId);
        result = form.toJson();
        return result;
    }

    // 결재문서 상신 처리
    public int addAppDoc(String compId, String dept, String title, String userNo, String sopp, String customer, String formId, String readable, String appDoc, String[] files, HashMap<String, String> attached, String[][] appLine) {
        int year = -1, x = -1, no = 0;
        String docNo = null, str = null, savedName = null, appData = null;
        String[] line = null;
        Long size = 0L;

        year = Calendar.getInstance().get(Calendar.YEAR);
        str = dept + "_" + year + "_";
        docNo = str + gwMapper.getNextDocNo(compId, str + "%");
        no = getNextNumberFromDB(compId, "bizcore.doc_app");

        // ========================= 문서 헤더정보 DB입력
        if(gwMapper.addNewDocHeader(no, compId, docNo, userNo, dept, title, formId, readable) < 1)    return -10; // 헤더정보 입력 실패

        // ========================= 결재선에 대한 처리
        appData = "{\"sopp\":" + (sopp == null ? sopp : "\"" + sopp + "\"") + ",\"customer\":" + (customer == null ? customer : "\"" + customer + "\"") + "}";
        gwMapper.addNewDocAppLineForSelf(compId, docNo, 0, userNo, "0", appDoc, appData); // 작성자 본인 입력
        if(appLine != null && appLine.length > 0)   for(x = 0 ; x < appLine.length ; x++){
            line = appLine[x];
            gwMapper.addNewDocAppLine(compId, docNo, x*10+10, line[1], line[0], null, null);        
        }

        // ========================= 첨부파일에 대한 처리 / 파일이 이 이동된 후 서버 에러 발생시 관리가 되지 않는 파일이 발생하기 때문에 파일에 대한 처리는 항상 마지막에 수행하도록 함
        if(files != null && attached != null)   for(x = 0 ; x < files.length ; x++){
            str = files[x];
            savedName = attached.get(str);
            size = moveTempFile(compId, "appDoc", no+"", savedName);
            if(size > 0)    systemMapper.setAttachedFileData(compId, "appDoc", no, str, savedName, size);
        }

        return no;
    }

    // 결재 예정 및 대기 문서 목록을 가져오는 메서드
    public String getWaitAndDueDocList(String compId, String userNo){
        String result = null, str = null, wait = "[]", due = "[]", refer = "[]", receive = "[]", t = null;
        List<HashMap<String, String>> list = null;
        HashMap<String, String> each = null;
        ArrayList<String> waitDocs = new ArrayList<>(), dueDocs = new ArrayList<>(), referDocs = new ArrayList<>();
        int x = 0; 

        // 예정/대기 문서코드 가져오기
        list = gwMapper.getWaitAndDueDocNo(compId, userNo);

        // 대기문서와 예정문서의 문서코드 분리
        for(x = 0 ; x < list.size() ; x++){
            each = list.get(x);
            if(each.get("stat").equals("wait"))         waitDocs.add(each.get("docno"));
            else if(each.get("stat").equals("due"))     dueDocs.add(each.get("docno"));
            else if(each.get("stat").equals("refer"))   referDocs.add(each.get("docno"));
        }

        // 대기문서 가져오기
        if(waitDocs.size() > 0){
            str = "";
            for(x = 0 ; x < waitDocs.size() ; x++){
                if(x > 0)   str += "','";
                str += waitDocs.get(x);
            }
            list = getAppDocList(compId, userNo, str);
            wait = "[";
            for(x = 0 ; x < list.size() ; x++){
                each = list.get(x);
                if(x > 0)   wait += ",";
                t = each.get("read");
                t = t == null || t.equals("0") ? "null" : "\"" + t + "\"";
                wait += "{";
                wait += ("\"no\":" + each.get("no") + ",");
                wait += ("\"docNo\":\"" + each.get("docno") + "\",");
                wait += ("\"writer\":" + each.get("writer") + ",");
                wait += ("\"created\":" + each.get("created") + ",");
                wait += ("\"form\":\"" + each.get("form") + "\",");
                wait += ("\"title\":\"" + each.get("title") + "\",");
                wait += ("\"appType\":" + each.get("appType") + ",");
                wait += ("\"read\":" + t);
                wait += "}";
            }
            wait += "]";
        }

        // 예정문서 가져오기
        if(dueDocs.size() > 0){
            str = "";
            for(x = 0 ; x < dueDocs.size() ; x++){
                if(x > 0)   str += "','";
                str += dueDocs.get(x);
            }
            list = getAppDocList(compId, userNo, str);
            due = "[";
            for(x = 0 ; x < list.size() ; x++){
                each = list.get(x);
                if(x > 0)   due += ",";
                t = each.get("read");
                t = t == null || t.equals("0") ? "null" : "\"" + t + "\"";
                due += "{";
                due += ("\"no\":" + each.get("no") + ",");
                due += ("\"docNo\":\"" + each.get("docno") + "\",");
                due += ("\"writer\":" + each.get("writer") + ",");
                due += ("\"created\":" + each.get("created") + ",");
                due += ("\"form\":\"" + each.get("form") + "\",");
                due += ("\"title\":\"" + each.get("title") + "\",");
                due += ("\"appType\":" + each.get("appType") + ",");
                due += ("\"read\":" + t);
                due += "}";
            }
            due += "]";
        }

        // 참조문서 가져오기
        if(referDocs.size() > 0){
            str = "";
            for(x = 0 ; x < referDocs.size() ; x++){
                if(x > 0)   str += "','";
                str += referDocs.get(x);
            }
            list = getAppDocList(compId, userNo, str);
            refer = "[";
            for(x = 0 ; x < list.size() ; x++){
                each = list.get(x);
                if(x > 0)   refer += ",";
                t = each.get("read");
                t = t == null || t.equals("0") ? "null" : "\"" + t + "\"";
                refer += "{";
                refer += ("\"no\":" + each.get("no") + ",");
                refer += ("\"docNo\":\"" + each.get("docno") + "\",");
                refer += ("\"writer\":" + each.get("writer") + ",");
                refer += ("\"created\":" + each.get("created") + ",");
                refer += ("\"form\":\"" + each.get("form") + "\",");
                refer += ("\"title\":\"" + each.get("title") + "\",");
                refer += ("\"appType\":" + each.get("appType") + ",");
                refer += ("\"read\":" + t);
                refer += "}";
            }
            refer += "]";
        }

        // 수신 문서 가져오기
        list = getReceivedDocList(compId, userNo);
        if(list != null && list.size() > 0){
            receive = "[";
            for(x = 0 ; x < list.size() ; x++){
                each = list.get(x);
                if(x > 0)   refer += ",";
                t = each.get("read");
                t = t == null || t.equals("0") ? "null" : "\"" + t + "\"";
                receive += "{";
                receive += ("\"no\":" + each.get("no") + ",");
                receive += ("\"docNo\":\"" + each.get("docno") + "\",");
                receive += ("\"writer\":" + each.get("writer") + ",");
                receive += ("\"created\":" + each.get("created") + ",");
                receive += ("\"form\":\"" + each.get("form") + "\",");
                receive += ("\"title\":\"" + each.get("title") + "\",");
                receive += ("\"appType\":" + each.get("appType") + ",");
                receive += ("\"read\":" + t);
                receive += "}";
            }
            receive += "]";
        }
        
        result = ("{\"wait\":" + wait + ",");
        result += ("\"due\":" + due + ",");
        result += ("\"refer\":" + refer + ",");
        result += ("\"receive\":" + receive + "}");

        return result;
    } // end of getWaitAndDueDicList()

    // (작성자 입장에서) 결재 진행중인 문서의 목록을 가져오는 메서드
    public String getProceedingDocList(String compId, String userNo){
        String result = null, t = null;
        List<HashMap<String, String>> list = null;
        ArrayList<String> item = null;
        HashMap<String, String> each = null;
        int x = 0;

        item = new ArrayList<>();
        list = gwMapper.getProceedingDocList(compId, userNo);
        if(list != null && list.size() > 0) for(x = 0 ; x < list.size() ; x++){
            each = list.get(x);
            t = "{\"no\":" + each.get("no") + ",";
            t += ("\"docNo\":\"" + each.get("docNo") + "\",");
            t += ("\"authority\":" + each.get("authority") + ",");
            t += ("\"created\":" + each.get("created") + ",");
            t += ("\"form\":\"" + each.get("form") + "\",");
            t += ("\"title\":\"" + each.get("title") + "\",");
            t += ("\"read\":" + each.get("read") + ",");
            t += ("\"appType\":" + each.get("appType") + "}");
            item.add(t);
        }

        result = "[";
        for(x = 0 ; x < item.size() ; x++){
            if(x > 0)   result += ",";
            result += item.get(x);
        }
        result += "]";

        return result;
    }

    // 문서 관리번호를 입력받아서 결재 문서 정보, 본문, 결재선, 첨부파일 정보를 전달하는 메서드 / 오류메시지 : notFound / errorInAppLine / appDocContentIsEmpty / permissionDenied
    public String getAppDocAndDetailInfo(String compId, String docNo, String dept, String userNo, String aesKey, String aesIv){
        String result = null;
        String sql1 = "SELECT no, docNo, writer, formId, docbox, title, confirmNo, status, readable FROM bizcore.doc_app WHERE deleted IS NULL AND compId = ? AND docno = ?";
        String sql2 = "SELECT ordered, employee, appType, CAST(UNIX_TIMESTAMP(`read`)*1000 AS CHAR) AS `read`, isModify, CAST(UNIX_TIMESTAMP(approved)*1000 AS CHAR) AS approved, CAST(UNIX_TIMESTAMP(rejected)*1000 AS CHAR) AS rejected, comment FROM bizcore.doc_app_detail WHERE compId = ? AND docNo = ? AND retrieved IS NULL ORDER BY ordered";
        String sql3 = "SELECT doc, appData FROM bizcore.doc_app_detail WHERE deleted IS NULL AND compId = ? AND ordered = (SELECT MAX(ordered) FROM bizcore.doc_app_detail WHERE deleted IS NULL AND compId = ? AND docNo = ? AND retrieved IS NULL AND (approved IS NOT NULL OR rejected IS NOT NULL)) AND docNo = ?";
        String no = null, writer = null, formId = null, docbox = null, title = null, confirmNo = null;
        String ordered = null, employee = null, appType = null, read = null, isModify = null, approved = null, rejected = null, comment = null, appData = null, t = null, doc = null;
        String docStatus = null, appCurrent = null, files = null, revisionHistory = null, customer = null, sopp = null;
        HashSet<String> appBefore = new HashSet<>(), appNext = new HashSet<>(), appRead = new HashSet<>(), appReceiver = new HashSet<>(), appAll = new HashSet<>();  
        List<HashMap<String, String>> list = null;
        HashMap<String, String> each = null;
        boolean readable = false;
        ArrayList<String> appLine = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        JSONObject json = null;
        int x = 0, status = -9999;

        try{
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql1);
            pstmt.setString(1, compId);
            pstmt.setString(2, docNo);
            rs = pstmt.executeQuery();
            if(!rs.next()){ // 결과가 없는 경우 / notFound 리턴메시지와 함께 종료하도록 함
                return "notFound";
            }else{
                no = rs.getString("no");
                writer = rs.getString("writer");
                formId = rs.getString("formId");
                docbox = rs.getString("docbox");
                title = rs.getString("title");
                confirmNo = rs.getString("confirmNo");
                status = rs.getInt("status"); // 상태코드 / -3 : 반려 / -2 : 결재취소 / -1 : 회수 / 0 : 임시저장 / 1 : 진행중 / 2 : 수신대기 / 3 : 완료
                t = rs.getString("readable");
                // 권한 : 완결되지 않은 문서는 readable가 true인 경우 결재선의 인원과 부서원, false인 경우 결재선에 있는 인원만 읽기 가능 / 완결된 문서는 부서원들 읽기 가능
                readable = t != null && t.equals("dept");
            }
            rs.close();
            pstmt.close();
            // ========== ↑ 문서 기본정보 읽기 완료 ==========

            // ========== ↓ 결재선 정보 읽기 시작 ==========
            pstmt = conn.prepareStatement(sql2);
            pstmt.setString(1, compId);
            pstmt.setString(2, docNo);
            rs = pstmt.executeQuery();
            while(rs.next()){
                ordered = rs.getString("ordered");
                employee = rs.getString("employee");
                appType = rs.getString("appType");
                read = rs.getString("read");
                isModify = rs.getString("isModify");
                approved = rs.getString("approved");
                rejected = rs.getString("rejected");
                comment = rs.getString("comment");

                t = "{\"ordered\":" + ordered + ",";
                t += ("\"employee\":" + employee + ",");
                t += ("\"appType\":" + appType + ",");
                t += ("\"read\":" + read + ",");
                t += ("\"isModify\":" + isModify.equals("1") + ",");
                t += ("\"approved\":" + approved + ",");
                t += ("\"rejected\":" + rejected + ",");
                t += ("\"comment\":\"" + comment + "\"}");
                if(appLine == null) appLine = new ArrayList<>();
                appLine.add(t);

                // 결재선에서 현재 결재선 담당과 이전, 이후를 저장함 / 권한 검증 및 문서상태 전달용
                appAll.add(employee);
                if(appType.equals("4")) appRead.add(employee);
                else if(appType.equals("3")) appReceiver.add(employee);
                else if(!writer.equals(userNo) || approved != null || rejected != null){ // 작성자 외 이미 결재한 사람
                    appBefore.add(employee);
                }else if(appCurrent == null && approved == null && rejected == null){ // 현재 결재 순번인 사람
                    appCurrent = employee;
                }else if(appCurrent != null && approved == null && rejected == null){ // 아직 결재 순서가 돌아오지 않은 사람
                    appNext.add(employee);
                }
            }
            rs.close();
            pstmt.close();
            if(appLine == null){
                return "errorInAppLine";
            }
            // ========== ↑ 결재선 정보 읽기 종료 ==========

            // ========== ↓ 권한 검증 시작 ==========
            // 상태코드 / -3 : 반려 / -2 : 결재취소 / -1 : 회수 / 0 : 임시저장 / 1 : 진행중 / 2 : 수신대기 / 3 : 완료
            // 결재 취소 및 임시저장은 작성자만 읽기 가능, 반려는 작성자와 반려자 이전 결재선 인원만 읽기 가능,
            // 회수/진행은 결재선에 존재하는 인원 중 수신자 제외 읽기 가능, 수신대기 및 완료는 젠체 읽기 가능
            
            if(!appAll.contains(userNo)){
                logger.info("==================== 결재문서 가져오기 : 결재선에 없음");
                return "permissionDenied";
            }else if(status == -3){
                if(writer.equals(userNo) || appBefore.contains(userNo) || appRead.contains(userNo)){
                    logger.info("==================== 결재문서 가져오기 : 반려");
                    docStatus = "rejected";
                }else{
                    logger.info("==================== 결재문서 가져오기 : 반려 / 권한 없음");
                    return "permissionDenied";
                }
            }else if(status == -2){
                if(writer.equals(userNo)){
                    logger.info("==================== 결재문서 가져오기 : 취소");
                    docStatus = "canceled";
                }   
                else{
                    logger.info("==================== 결재문서 가져오기 : 취소 / 권한없음");
                    return "permissionDenied";
                }
            }else if(status == 0){
                if(writer.equals(userNo)){
                    logger.info("==================== 결재문서 가져오기 : 취소");
                    docStatus = "temp";
                }   
                else{
                    logger.info("==================== 결재문서 가져오기 : 권한없음");
                    return "permissionDenied";
                }
            }else if(status == 1){
                if(writer.equals(userNo) || appBefore.contains(userNo) || appRead.contains(userNo)){
                    logger.info("==================== 결재문서 가져오기 : 진행 / 진행중");
                    docStatus = "proceed";
                }else if(appCurrent.equals("userNo")){
                    logger.info("==================== 결재문서 가져오기 : 진행 : 결재순번");
                    docStatus = "wait";
                }else if(appNext.contains(userNo)){
                    logger.info("==================== 결재문서 가져오기 : 진행 / 예정");
                    docStatus = "due";
                }else{
                    logger.info("==================== 결재문서 가져오기 : 진행 / 권한없음");
                    return "permissionDenied";
                } 
            }else if(status == 2){
                if(writer.equals(userNo) || appBefore.contains(userNo) || appRead.contains(userNo)){
                    logger.info("==================== 결재문서 가져오기 : 수신 : 진행중");
                    docStatus = "proceed";
                }else if(appReceiver.contains(userNo)){
                    logger.info("==================== 결재문서 가져오기 : 수신 / 수신대기");
                    docStatus = "wait";
                }else if(appNext.contains(userNo)){
                    logger.info("==================== 결재문서 가져오기 : 수신 / 예정");
                    docStatus = "due";
                }else{
                    logger.info("==================== 결재문서 가져오기 : 수신 / 권한없음");
                    return "permissionDenied";
                }                   
            }else if(status == 3){
                if(appAll.contains(userNo)){
                    logger.info("==================== 결재문서 가져오기 : 완료");
                    docStatus = "read";
                }else{
                    logger.info("==================== 결재문서 가져오기 : 완료 / 권한없음 " + userNo);
                    logger.info(appAll.toString());
                    return  "permissionDenied";                
                }
            }
            
            // ========== ↑ 권한 검증 종료 ==========

            // ========== ↓ 첨부파일 이름 가져오기 시작 ==========
            files = "[";
            list = systemMapper.getAttachedFileList(compId, "appDoc", strToInt(no));
            if(list != null && list.size() > 0) for(x = 0 ; x < list.size() ; x++){
                each = list.get(x);
                if(x > 0)   files += ",";
                files += ("{\"fileName\":\"" + each.get("fileName") + "\",");
                files += ("\"size\":" + each.get("size") + ",");
                files += ("\"removed\":" + each.get("removed").equals("1") + "}");
            }
            files += "]";

            // ========== ↑ 첨부파일 이름 가져오기 종료 ==========

            // ========== ↓ 문서 수정이력 가져오기 시작 ==========
            revisionHistory = "[";
            list = gwMapper.getRevisionHistory(compId, docNo);
            if(list != null && list.size() > 0) for(x = 0 ; x < list.size() ; x++){
                each = list.get(x);
                if(x > 0)   revisionHistory += ",";
                revisionHistory += ("{\"employee\":" + each.get("employee") + ",");
                revisionHistory += ("\"date\":" + each.get("created") + ",");
                revisionHistory += ("\"content\":" + each.get("content") + "}");
            }
            revisionHistory += "]";

            // ========== ↑ 문서 수정이력 가져오기 종료 ==========

            // ========== ↓ 결재 문서 읽기 시작 ==========
            pstmt = conn.prepareStatement(sql3);
            pstmt.setString(1, compId);
            pstmt.setString(2, compId);
            pstmt.setString(3, docNo);
            pstmt.setString(4, docNo);
            rs = pstmt.executeQuery();
            if(!rs.next()){
                return "appDocContentIsEmpty";
            }else{
                doc = rs.getString("doc");
                appData = rs.getString("appData");

                if(appData != null){
                    json = new JSONObject(appData);
                    customer = json.isNull("customer") ? null : json.getString("customer");
                    sopp = json.isNull("sopp") ? null : json.getString("sopp");
                }
            }
            rs.close();
            pstmt.close();

            // ========== ↑ 결재 문서 읽기 종료 ==========

            // ========== ↓ 전체 데이터 병합 ==========
            
            // 결재선 정보 배열로 병합처리
            t = "[";
            for(x = 0 ; x < appLine.size() ; x++){
                if(x > 0)   t += ",";
                t += appLine.get(x);
            }
            t += "]";
            
            result = "{\"no\":" + no + ",";
            result += ("\"docNo\":\"" + docNo + "\",");
            result += ("\"writer\":" + writer + ",");
            result += ("\"formId\":\"" + formId + "\",");
            result += ("\"docbox\":\"" + docbox + "\",");
            result += ("\"title\":\"" + title + "\",");
            result += ("\"confirmNo\":\"" + confirmNo + "\",");
            result += ("\"status\":\"" + docStatus + "\",");
            result += ("\"readable\":\"" + (readable ? "dept" : "none") + "\",");
            result += ("\"appLine\":" + t + ",");
            result += ("\"customer\":\"" + sopp + "\",");
            result += ("\"sopp\":\"" + sopp + "\",");
            result += ("\"revisionHistory\":" + revisionHistory + ",");
            result += ("\"fileList\":" + files + ",");
            result += ("\"doc\":\"" + encAes(doc, aesKey, aesIv) + "\"}");
            
        }catch(SQLException e){e.printStackTrace();}

        gwMapper.setDocReadTime(compId, userNo, docNo);

        return result;
    } // End of getAppDocAndDetailInfo()

    // 결재문서 처리 메서드 / 데이터가 null이 아닌 경우 결재문서에 대한 수정 처리
    public String askAppDoc(String compId, String docNo, int ordered, int ask, String comment, String doc,
            String[][] appLine, String[] files, HashMap<String, String> attached, String appData, String userNo) {
        String result = null, revision = null, savedName = null, fileName = null, t = null;
        JSONObject json = null;
        int writer = -9999, appType = -9999, no = -9999, x = -1, y = -1;
        List<String> prvFiles = null, tFiles = null, newFiles = null;
        HashMap<String, Integer> next = null;
        HashMap<String, String> map = null;
        long size = -1;
        boolean find = false;

        // 기본정보들이 갖추어져 있는지 먼저 검증
        if(compId == null || docNo == null || ordered < 1 || ask < 0 || ask > 1 || userNo == null)  return null;

        // 작성자와 일련번호 확인
        map = gwMapper.getAppDocWriterAndSN(compId, docNo);logger.error("======================= " + compId + " / " + docNo);
        if(map == null)    return null;
        t = map.get("writer"); // 작성자
        writer = t == null ? -1 : strToInt(t);
        t = map.get("no"); // 일련번호
        no = t == null ? -1 : strToInt(t);

        // 요청자에게 결재권한이 있는지, 승인 타입은 어떠한지 확인
        map = gwMapper.getAppTypeAndEmployee(compId, docNo, ordered);
        if(map == null)    return null;
        t = map.get("employee"); // 결재자 사번
        x = t == null ? -1 : strToInt(t);
        t = map.get("appType"); // 결재 유형
        appType = t == null ? -1 : strToInt(t);

        // 권한 확인
        if(!userNo.equals((x+"")))  return "permissionDenied";

        // 문서 반려 처리
        if(ask == 0){
            // 결배문서의 반려 처리에 대한 알림 입력
            notes.sendNewNotes(compId, 0, writer, "결재문서가 반려되었습니다.", "{\"func\":\"docApp\",\"no\":\"" + docNo + "\"}");
            gwMapper.setDocAppLineRejected(compId, docNo, ordered);
            gwMapper.setDocAppRejected(compId, docNo);
            result = "ok";
        }

        // 결재문서 승인 처리
        if(ask == 1){

            // 문서 수정여부 확인 / 수정이 이루어진 경우 수정 이력 반영 필요
            if(doc != null || appLine != null || files != null){
                json = new JSONObject();
                
                // 수정된 결재문서에 대한 처리
                if(doc != null){
                    json.put("doc", true);
                    gwMapper.updateAppDocContent(compId, docNo, ordered, doc);
                }else{
                    json.put("doc", false);
                }

                // 수정된 결재선에 대한 처리
                if(appLine != null){
                    json.put("appLine", true);
                    gwMapper.deleteAppLineSinceEditAppline(compId, docNo, ordered);
                    
                    // 현재 결제유형이 "결재"인 경우, 수정된 결재선에 결재자가 존재하는 경우 현재의 결재유형을 검토로 수정함
                    if(appType == 2){
                        for(x = 0 ; x < appLine.length ; x++){
                            if(appLine[x][0].equals("2")){
                                appType = 0;
                                gwMapper.changeAppType(compId, docNo, ordered, appType);
                                break;
                            }
                        }
                    }

                    // 변경된 결재선 DB 입력
                    y = ((ordered / 10) + 1) * 10;
                    for(x = 0 ; x < appLine.length ; x++, no = no + 10){
                        gwMapper.addNewDocAppLine(compId, docNo, y, appLine[x][1], appLine[x][0], null, null);        
                    }
                }else{
                    json.put("appLine", false);
                } // 결재선의 수정에 대한 처리 종료

                // 수정된 첨부파일에 대한 처리
                if(files != null && attached != null){
                    json.put("files", true);
                    prvFiles = systemMapper.getAttachedList(compId, "docApp", no);
                    newFiles = new ArrayList<>();
                    for(x = 0 ; x < files.length ; x++) newFiles.add(files[x]);
                    
                    // 기존 파일을 제거하고 신규 파일로 대체된 경우의 처리
                    tFiles = new ArrayList<>();
                    for(x = 0 ; x < prvFiles.size() ; x++){
                        for(y = 0 ; y < newFiles.size() ; y++){
                            if(prvFiles.get(x).equals(newFiles.get(y))){
                                fileName = newFiles.get(y);
                                savedName = attached.get(savedName);
                                if(savedName != null){
                                    t = systemMapper.getAttachedFileName(compId, "docApp", no, fileName);
                                    deleteAttachedFile(compId, "docApp", no, t);
                                    size = moveTempFile(compId, "docApp", no+"", savedName);
                                    if(size > 0){
                                        systemMapper.setAttachedFileData(compId, "docApp", no, fileName, savedName, size);
                                    }
                                }
                                tFiles.add(fileName);
                            }
                        }
                    }

                    // 기 처리된 파일 목록 제거
                    for(x = 0 ; x < tFiles.size() ; x++){
                        prvFiles.remove(tFiles.get(x));
                        newFiles.remove(tFiles.get(x));
                    }

                    // 제거된 파일에 대한 처리
                    tFiles = new ArrayList<>();
                    for(x = 0 ; x < prvFiles.size() ; x++){
                        find = false;
                        for(y = 0 ; y < newFiles.size() ; y++){
                            if(prvFiles.get(x).equals(newFiles.get(y))){
                                find = true;
                                break;
                            }
                        }
                        if(!find)   tFiles.add(prvFiles.get(y));
                    }
                    for(x = 0 ; x < tFiles.size() ; x++){
                        t = tFiles.get(x);
                        deleteAttachedFile(compId, "docApp", no, t);
                        prvFiles.remove(t);
                    }

                    // 추가된 파일에 대한 처리
                    tFiles = new ArrayList<>();
                    for(x = 0 ; x < newFiles.size() ; x++){
                        find = false;
                        for(y = 0 ; y < prvFiles.size() ; y++){
                            if(newFiles.get(x).equals(prvFiles.get(y))){
                                find = true;
                                break;
                            }
                        }
                        if(!find)   tFiles.add(newFiles.get(y));
                    }
                    for(x = 0 ; x < tFiles.size() ; x++){
                        fileName = tFiles.get(x);
                        savedName = attached.get(fileName);
                        size = moveTempFile(compId, "docApp", no+"", savedName);
                        if(size > 0)    systemMapper.setAttachedFileData(compId, "docApp", no, fileName, savedName, size);
                    }

                }else{
                    json.put("files", false);
                } // 첨부파일 수정에 대한 처리 종료
                revision = json.toString();
                gwMapper.setModifiedAppLine(compId, docNo, ordered);
                gwMapper.addRevisionHistory2(compId, docNo, ordered, userNo, revision);
            } // 문서가 수정된 경우의 처리 종료

            // 결재처리를 기록함
            gwMapper.setProceedDocAppStatus(compId, docNo, ordered, comment, appData);

            // 남아있는 결재 절차가 있는지 확인함
            next = gwMapper.getNextAppData(compId, docNo, ordered);

            if(next == null){ // 결재절차가 종료된 경우
                notes.sendNewNotes(compId, 0, writer, "결재 완료 되었습니다.", "{\"func\":\"docApp\",\"no\":\"" + docNo + "\"}");
                result = "ok";
            }else{
                x = next.get("employee");
                y = next.get("appType");
                if(y == 0)      t = "검토";
                else if(y == 1) t = "합의";
                else if(y == 2) t = "결재";
                else            t = "수신";
                notes.sendNewNotes(compId, 0, x, t + "할 문서가 있습니다.", "{\"func\":\"docApp\",\"no\":\"" + docNo + "\"}");
                result = "ok";
            }
        }
        
        return result;
    } // End of askAppDoc() // 결재 처리 종료




    // ========================================= P R I V A T E _ M E T H O D =========================================

    // 결재 예정 및 대기 문서 목록을 DB에서 가져오는 메서드 //  아래 sqlIn 값을 매퍼에서 처리하지 못하기에 만등어넣음
    private List<HashMap<String, String>> getAppDocList(String compId, String userNo, String sqlIn){
        List<HashMap<String, String>> result = new ArrayList<>();
        HashMap<String, String> each = null;
        String sql = "SELECT CAST(a.no AS CHAR) AS no, a.docno AS docno, CAST(a.writer AS CHAR) AS writer, CAST(UNIX_TIMESTAMP(a.created)*1000 AS CHAR) AS created, c.title AS form, a.title AS title, CAST(UNIX_TIMESTAMP(b.`read`)*1000 AS CHAR) AS `read`, CAST(b.apptype AS CHAR) AS appType FROM bizcore.doc_app a, bizcore.doc_app_detail b, bizcore.doc_form c WHERE b.deleted IS NULL AND c.id=a.formid AND a.compid=? AND b.employee=? AND a.docno=b.docno AND b.ordered > 0 AND a.status=1 AND a.docno IN ('" + sqlIn + "')";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try{
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, compId);
            pstmt.setString(2, userNo);
            //pstmt.setString(3, sqlIn);
            rs = pstmt.executeQuery();
            while(rs.next()){
                each = new HashMap<>();
                each.put("no", rs.getString(1));
                each.put("docno", rs.getString(2));
                each.put("writer", rs.getString(3));
                each.put("created", rs.getString(4));
                each.put("form", rs.getString(5));
                each.put("title", rs.getString(6));
                each.put("read", rs.getString(7));
                each.put("appType", rs.getString(8));
                result.add(each);
            }
        }catch(SQLException e){e.printStackTrace();}
        return result;
    }

    // 수신 문서 목록을 전달하는 메서드
    private List<HashMap<String, String>> getReceivedDocList(String compId, String userNo){
        List<HashMap<String, String>> result = null;
        HashMap<String, String> each = null;
        String sql = "SELECT CAST(a.no AS CHAR) AS no, a.docno AS docno, CAST(a.writer AS CHAR) AS writer, CAST(UNIX_TIMESTAMP(a.created)*1000 AS CHAR) AS created, c.title AS form, a.title AS title, CAST(UNIX_TIMESTAMP(b.`read`)*1000 AS CHAR) AS `read`, CAST(b.apptype AS CHAR) AS appType FROM bizcore.doc_app a, bizcore.doc_app_detail b, bizcore.doc_form c WHERE b.deleted IS NULL AND a.docno = b.docno AND a.compId = b.compId AND b.approved IS NULL AND b.rejected IS NULL AND a.formid = c.id AND a.status = 2 AND b.appType = 3 AND a.compId = ? AND b.employee = ? ORDER BY no";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try{
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, compId);
            pstmt.setString(2, userNo);
            rs = pstmt.executeQuery();
            while(rs.next()){
                if(result == null)  result = new ArrayList<>();
                each = new HashMap<>();
                each.put("no", rs.getString(1));
                each.put("docno", rs.getString(2));
                each.put("writer", rs.getString(3));
                each.put("created", rs.getString(4));
                each.put("form", rs.getString(5));
                each.put("title", rs.getString(6));
                each.put("read", rs.getString(7));
                each.put("appType", rs.getString(8));
                result.add(each);
            }
        }catch(SQLException e){e.printStackTrace();}
        return result;
    }
    
}
