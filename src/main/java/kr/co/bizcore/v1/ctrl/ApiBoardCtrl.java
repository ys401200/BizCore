package kr.co.bizcore.v1.ctrl;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.websocket.server.PathParam;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.bizcore.v1.domain.Article;
import kr.co.bizcore.v1.domain.AttachedFile;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.RequestMethod;


@RestController
@RequestMapping("/api/board")
@Slf4j
public class ApiBoardCtrl extends Ctrl{

    private static final Logger logger = LoggerFactory.getLogger(ApiBoardCtrl.class);

    // 자료실 목록
    @RequestMapping(value="/filebox", method=RequestMethod.GET)
    public String fileboxGet(HttpServletRequest request) {
        String result = null;
        String compId = null;
        String aesKey = null;
        String aesIv = null;
        HttpSession session = null;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)session.getAttribute("compId");
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
        }else{
            result = boardService.getFileboxArticleList(compId);
            result = boardService.encAes(result, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
        }
        
        return result;
    } // End of fileBoxGet()

    // 자료실 게시글 신규
    @RequestMapping(value="/filebox", method=RequestMethod.POST)
    public String fileboxPost(HttpServletRequest request, @RequestBody String requestBody) {
        String result = null;
        String userNo = null;
        String aesKey = null;
        String aesIv = null;
        String compId = null;
        List<Object> files = null;
        Article article = null;
        HttpSession session = null;
        HashMap<String, String> attached = null;
        String data = null;
        int count = 0;
        JSONObject json = null;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        userNo = (String)session.getAttribute("userNo");
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        attached = (HashMap<String, String>)session.getAttribute("attached");
        
        if(compId == null)  compId = (String)request.getAttribute("compId");
            
        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
        }else{
            data = boardService.decAes(requestBody, aesKey, aesIv);
            json = new JSONObject(data);
            article = new Article();
            files = json.getJSONArray("files").toList();
            article.setWriter(boardService.strToInt(userNo));
            article.setTitle(json.getString("title"));
            article.setContent(json.getString("content"));

            count = boardService.postNewArticle(compId, article, files, attached);
            result = "{\"result\":\"ok\",\"msg\":\"success file upload and add article. file count : " + count + "\"}";
        }
        
        return result;
    } // End of fileBoxGet()

    // 게시글 삭제 / 첨부된 파일에 대한 디스크 및 DB삭제 처리 수행
    @RequestMapping(value="/filebox/{no}", method=RequestMethod.DELETE)
    public String fileboxDelete(HttpServletRequest request, @PathVariable String no) {
        String result = null;
        HttpSession session = null;
        String compId = null;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");
        
        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else{
            boardService.deleteFileboxArticle(no, compId);
            result = "{\"result\":\"ok\"}";
        }
        
        return result;
    } // End of fileboxDelete()

    // 게시글 조회
    @RequestMapping(value="/filebox/{no}", method=RequestMethod.GET)
    public String fileboxOptionGet(HttpServletRequest request, @PathVariable String no) {
        String result = null;
        String aesKey = null;
        String aesIv = null;
        String compId = null;
        String articleNo = null;
        Article article = null;
        HttpSession session = null;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        if(compId == null)  compId = (String)request.getAttribute("compId");
        
        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
        }else{
            article = boardService.getFileboxArticle(compId, boardService.strToInt(no));
            result = article.toJson();
            result = boardService.encAes(result, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
        }
    
        return result;
    } // End of fileboxOptionGet()

    // 게시글 파일 첨부 / 편집 중 사전 업로드 후 attached에 저장된 파일명을 기준으로 임시폴더에서 첨부폴더로 사후 이동
    @RequestMapping(value="/filebox/attached", method=RequestMethod.POST)
    public String fileboxAttachedPost(HttpServletRequest request, @RequestBody String requestBody) throws UnsupportedEncodingException {
        String result = null;
        String name = null;
        String savedName = null;
        String file = null;
        String aesKey = null;
        String aesIv = null;
        String compId = null;
        HttpSession session = null;
        HashMap<String, String> attached = null;
        String[] data = null;
        String t = null;
        byte[] fileData = null;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        attached = (HashMap<String, String>)session.getAttribute("attached");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
        }else{
            data = requestBody.split("\r\n");
            if(data != null && data.length >= 2){
                name = data[0];
                file = data[1];
                t = boardService.decAes(file, aesKey, aesIv);
                fileData = Base64.getDecoder().decode(t);
                savedName = systemService.createRandomFileName();
                if(boardService.saveAttachedFile(compId, savedName, fileData)){
                    if(attached == null){
                        attached = new HashMap<>();
                        session.setAttribute("attached", attached);
                    }
                    attached.put(name, savedName);
                    result = "{\"result\":\"ok\",\"msg\":\"" + savedName + "\"}";
                }else   result = "{\"result\":\"failure\",\"msg\":\"Error occured when file saved.\"}";
            }
        }

        return result;
    } // End of fileboxAttachedPost()

    // 게시글 수정 / addFiles에 사전 추가된 파일명 목록을, removeFiles에 기존 파일 중 삭제 목록을 담도록 함
    @RequestMapping(value="/filebox/{no}", method=RequestMethod.PUT)
    public String fileboxOptionPut(HttpServletRequest request, @RequestBody String requestBody, @PathVariable String no) {
        String result = null;
        String aesKey = null;
        String aesIv = null;
        String compId = null;
        String data = null;
        JSONObject json = null;
        Article article = null;
        List<Object> removeFiles = null;
        List<Object> addFiles = null;
        HttpSession session = null;
        HashMap<String, String> attached = null;

        logger.info("[ACCESS] /api/board/filebox :: PUT ::" + request.getRemoteAddr());
        
        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        attached = (HashMap<String, String>)session.getAttribute("attached");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
        }else{
            data = boardService.decAes(requestBody, aesKey, aesIv);
            json = new JSONObject(data);
            article = new Article();
            addFiles = json.getJSONArray("addFiles").toList();
            removeFiles = json.getJSONArray("removeFiles").toList();
            article.setNo(strToInt(no));
            article.setTitle(json.getString("title"));
            article.setContent(json.getString("content"));

            logger.info("[ACCESS] /api/board/filebox :: remove file count : " + removeFiles.size());
            logger.info("[ACCESS] /api/board/filebox :: add file count : " + addFiles.size());
            boardService.updateFileboxArticle(compId, article, addFiles, removeFiles, attached);
            result = "{\"result\":\"ok\"}";
        }

        
        return result;
    } // End of fileBox
    
    // 첨부된 파일 다운로드 / /filebox/글번호/첨부파일명 / 첨부파일명은 uri 인코딩 되어 있을 것
    @RequestMapping(value="/filebox/{no}/{fileName}", method=RequestMethod.GET)
    public void fileboxAttachedDownload(HttpServletRequest request, HttpServletResponse response, @PathVariable String no, @PathVariable String fileName) {
        HttpSession session = null;
        ServletOutputStream out = null;
        String compId = null;
        byte[] data = null;
        
        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            response.setStatus(404);
        }else{
            data = boardService.getFileboxAttachedFile(no, fileName, compId);
            if(data == null){
                response.setStatus(404);
            }else{
                try {
                    response.reset();
                    response.setContentType("Content-type: application/x-msdownload; charset=euc-kr");
                    response.setHeader("Content-Disposition", "attachment;filename="+new String(fileName.getBytes("euc-kr"),"8859_1"));
                    response.setHeader("Content-Transfer-Encoding", "binary;");
                    response.setHeader("Pragma", "no-cache;");
                    response.setHeader("Expires", "-1;");
                    response.setContentLength(data.length); //파일크기를 브라우저에 알려준다.
                    
                    out = response.getOutputStream();
                    out.write(data);
                    out.flush();
                } catch (IOException e) {
                    response.setStatus(500);
                }
            }
        }

    } // End of fileBox
}


