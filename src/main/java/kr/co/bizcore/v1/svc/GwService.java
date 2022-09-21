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
import java.util.List;

import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.DocForm;
import kr.co.bizcore.v1.mapper.GwMapper;

@Service
public class GwService extends Svc{

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
        int result = -9999;
        int year = -1, x = -1, read = 0;
        String docNo = null, str = null, savedName = null, rootPath = fileStoragePath, s = File.separator, appData = null;;
        String[] line = null;
        File source = null, target = null;
        Long size = 0L;
        FileInputStream fin = null;
        FileOutputStream fout = null;
        byte[] buffer = new byte[1024];

        year = Calendar.getInstance().get(Calendar.YEAR);
        str = dept + "_" + year + "_";
        docNo = str + gwMapper.getNextDocNo(compId, str + "%");
        result = getNextNumberFromDB(compId, "bizcore.doc_app");

        // 문서 헤더정보 DB입력
        if(gwMapper.addNewDocHeader(result, compId, docNo, userNo, dept, title, formId, readable) < 1)    return -10; // 헤더정보 입력 실패

        // 결재선에 대한 처리
        appData = "{\"sopp\":\"" + sopp + "\",\"customer\":\"" + customer + "\"}";
        gwMapper.addNewDocAppLineForSelf(compId, docNo, 0, userNo, "0", appDoc, appData); // 작성자 본인 입력
        if(appLine != null && appLine.length > 0)   for(x = 0 ; x < appLine.length ; x++){
            line = appLine[x];
            gwMapper.addNewDocAppLine(compId, docNo, x*10+10, line[1], line[0], null, null);        
        }

        // 첨부파일에 대한 처리 / 파일이 이 이동된 후 서버 에러 발생시 관리가 되지 않는 파일이 발생하기 때문에 파일에 대한 처리는 항상 마지막에 수행하도록 함
        rootPath = rootPath + s + compId;
        if(files != null && files.length > 0)   for(x = 0 ; x < files.length ; x++){
            str = files[x];
            savedName = attached.get(str);
            source = new File(rootPath + s + "temp" + s + savedName);
            target = new File(rootPath + s + "appDoc" + s + savedName);
            if(savedName != null && source.exists()){
                if(source.renameTo(target)){ // 1차 : renameTo()로 간단히 이동 시도
                    systemMapper.setAttachedFileData(compId, "docapp", result, str, savedName, target.length());
                }else{  // 실패시 2차 시도 : 파일 읽어서 이동 후 임시 파일 삭제
                    try {
                        fin = new FileInputStream(source);
                        fout = new FileOutputStream(target);
                        read = 0;
                        while((read = fin.read(buffer, 0, buffer.length)) != -1){
                            fout.write(buffer, 0, read);
                        }
                        fin.close();
                        fout.flush();
                        fout.close();
                        source.delete();
                        systemMapper.setAttachedFileData(compId, "docapp", result, str, savedName, target.length());
                    } catch (Exception e) {e.printStackTrace();}
                }
            }
        }
        
        return result;
    }

    // 결재 예정 및 대기 문서 목록을 가져오는 메서드
    public String getWaitAndDueDocList(String compId, String userNo){
        String result = null, str = null, wait = "[]", due = "[]", refer = "[]", t = null;
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
        
        result = ("{\"wait\":" + wait + ",");
        result += ("\"due\":" + due + ",");
        result += ("\"refer\":" + refer + ",");
        result += ("\"receive\":" + "[]" + "}");

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

    // 문서 관리번호를 입력받아서 결재 문서 정보, 본문, 결재선을 전달하는 메서드 / 오류메시지 : notFound / errorInAppLine / appDocContentIsEmpty / permissionDenied
    public String getAppDocAndDetailInfo(String compId, String docNo, String dept, String userNo){
        String result = null;
        String sql1 = "SELECT no, docNo, writer, formId, docbox, title, confirmNo, status, readable FROM bizcore.doc_app WHERE deleted IS NULL AND compId = ? AND docno = ?";
        String sql2 = "SELECT ordered, employee, appType, CAST(UNIX_TIMESTAMP(`read`)*1000 AS CHAR) AS `read`, isModify, CAST(UNIX_TIMESTAMP(approved)*1000 AS CHAR) AS approved, CAST(UNIX_TIMESTAMP(rejected)*1000 AS CHAR) AS rejected, comment, appData FROM bizcore.doc_app_detail WHERE compId = ? AND docNo = ? AND retrieved IS NULL ORDER BY ordered";
        String sql3 = "SELECT doc FROM bizcore.doc_app_detail WHERE compId = ? AND ordered = (SELECT MAX(ordered) FROM bizcore.doc_app_detail WHERE compId = ? AND docNo = ? AND retrieved IS NULL AND (approved IS NOT NULL OR rejected IS NOT NULL)) AND docNo = ?";
        String no = null, writer = null, formId = null, docbox = null, title = null, confirmNo = null, status = null;
        String ordered = null, employee = null, appType = null, read = null, isModify = null, approved = null, rejected = null, comment = null, appData = null, t = null, doc = null;
        boolean readable = false;
        ArrayList<String> appLine = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        int x = 0;

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
                status = rs.getString("status");
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
                appData = rs.getString("appData");
                t = "{\"ordered\":" + ordered + ",";
                t += ("\"employee\":" + employee + ",");
                t += ("\"appType\":" + appType + ",");
                t += ("\"read\":" + read + ",");
                t += ("\"isModify\":" + isModify.equals("1") + ",");
                t += ("\"approved\":" + approved + ",");
                t += ("\"rejected\":" + rejected + ",");
                t += ("\"comment\":\"" + comment + "\",");
                t += ("\"appData\":" + appData + "}");
                if(appLine == null) appLine = new ArrayList<>();
                appLine.add(t);
            }
            rs.close();
            pstmt.close();
            if(appLine == null){
                return "errorInAppLine";
            }
            // ========== ↑ 결재선 정보 읽기 종료 ==========

            // ========== ↓ 권한 검증 시작 ==========

            // ============================================================================================
            // ===================================================== 권한검증 코드 ============================================
            // ============================================================================================

            // ========== ↑ 권한 검증 종료 ==========

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
            result += ("\"status\":" + status + ",");
            result += ("\"readable\":\"" + (readable ? "dept" : "none") + "\",");
            result += ("\"appLine\":" + t + ",");
            result += ("\"doc\":\"" + cvtJsonUnicode(doc) + "\"}");
            
        }catch(SQLException e){e.printStackTrace();}

        return result;
    } // End of getAppDocAndDetailInfo()




    // ========================================= P R I V A T E _ M E T H O D =========================================

    // 결재 예정 및 대기 문서 목록을 DB에서 가져오는 메서드 //  아래 sqlIn 값을 매퍼에서 처리하지 못하기에 만등어넣음
    private List<HashMap<String, String>> getAppDocList(String compId, String userNo, String sqlIn){
        List<HashMap<String, String>> result = new ArrayList<>();
        HashMap<String, String> each = null;
        String sql = "SELECT CAST(a.no AS CHAR) AS no, a.docno AS docno, CAST(a.writer AS CHAR) AS writer, CAST(UNIX_TIMESTAMP(a.created)*1000 AS CHAR) AS created, c.title AS form, a.title AS title, CAST(UNIX_TIMESTAMP(b.`read`)*1000 AS CHAR) AS `read`, CAST(b.apptype AS CHAR) AS appType FROM bizcore.doc_app a, bizcore.doc_app_detail b, bizcore.doc_form c WHERE c.id=a.formid AND a.compid=? AND b.employee=? AND a.docno=b.docno AND b.ordered > 0 AND a.status=1 AND a.docno IN ('" + sqlIn + "')";
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
            if(rs.next()){
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
