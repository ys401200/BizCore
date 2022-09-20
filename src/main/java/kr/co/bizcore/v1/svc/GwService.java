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




    // ========================================= P R I V A T E _ M E T H O D =========================================

    // 결재 예정 및 대기 문서 목록을 DB에서 가져오는 메서드 //  sql
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
