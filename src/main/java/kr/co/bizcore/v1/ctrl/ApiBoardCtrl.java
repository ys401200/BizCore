package kr.co.bizcore.v1.ctrl;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.bizcore.v1.domain.Article;

import org.springframework.web.bind.annotation.RequestMethod;


@RestController
@RequestMapping("/api/board")
public class ApiBoardCtrl extends Ctrl{

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

    @RequestMapping(value="/filebox", method=RequestMethod.POST)
    public String fileboxPost(HttpServletRequest request, @RequestBody String requestBody) {
        String result = null;
        String userNo = null;
        String aesKey = null;
        String aesIv = null;
        String compId = null;
        List<Object> files = null;
        Article article = null;
        JSONObject json = null;
        HttpSession session = null;
        HashMap<String, String> attached = null;
        String data = null;
        int count = 0;

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

    
    @RequestMapping(value="/filebox", method=RequestMethod.DELETE)
    public String fileboxDelete(HttpServletRequest request) {
        String result = null;
        
        
        
        return result;
    } // End of fileBoxGet()

    @RequestMapping(value="/filebox", method=RequestMethod.PUT)
    public String fileboxPut(HttpServletRequest request, @RequestBody String requestBody) {
        String result = null;
        
        
        
        return result;
    } // End of fileBoxGet()

    @RequestMapping(value="/filebox/**", method=RequestMethod.GET)
    public String fileboxOptionGet(HttpServletRequest request) {
        String result = null;
        String uri = null;
        String[] t = null;
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
        
        uri = request.getRequestURI();
        if (uri.substring(0, 1).equals("/"))
            uri = uri.substring(1);
        if (uri.substring(uri.length() - 1).equals("/"))
            uri = uri.substring(0, uri.length() - 1);
        t = uri.split("/");

        if(t.length >= 4 || t[3].equals("attached")){ // 첨부파일 모드

        }else if(t.length >= 4){ // 자료실 게시글 번호 모드
            articleNo = t[3];
            if(compId == null){
                result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
            }else if(aesKey == null || aesIv == null){
                result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
            }else if(articleNo == null){
                result = "{\"result\":\"failure\",\"msg\":\"Article number is Not verified.\"}";
            }else{
                article = boardService.getFileboxArticle(compId, boardService.strToInt(articleNo));
                result = article.toJson();
                result = boardService.encAes(result, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + result + "\"}";
            }
        }
        
        return result;
    } // End of fileBox

    @RequestMapping(value="/filebox/**", method=RequestMethod.POST)
    public String fileboxOptionPost(HttpServletRequest request, @RequestBody String requestBody) {
        String result = null;
        String uri = null;
        String name = null;
        String savedName = null;
        String file = null;
        String aesKey = null;
        String aesIv = null;
        String compId = null;
        HttpSession session = null;
        HashMap<String, String> attached = null;
        String[] data = null;
        byte[] fileData = null;
        String[] t = null;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        attached = (HashMap<String, String>)session.getAttribute("attached");
        if(compId == null)  compId = (String)request.getAttribute("compId");
        
        uri = request.getRequestURI();
        if (uri.substring(0, 1).equals("/"))
            uri = uri.substring(1);
        if (uri.substring(uri.length() - 1).equals("/"))
            uri = uri.substring(0, uri.length() - 1);
        t = uri.split("/");

        if(t.length >= 4 || t[3].equals("attached")){ // ================= 첨부파일 모드

            if(compId == null){
                result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
            }else if(aesKey == null || aesIv == null){
                result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
            }else{
                data = requestBody.split("\r\n");
                if(data != null && data.length >= 2){
                    name = data[0];
                    file = data[1];
                    fileData = boardService.decAesBinary(file, aesKey, aesIv);
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

        }else{ // ====================== 자료실 게시글 번호 모드

        }
        
        return result;
    } // End of fileBox

    @RequestMapping(value="/filebox/**", method=RequestMethod.PUT)
    public String fileboxOptionPut(HttpServletRequest request, @RequestBody String requestBody) {
        String result = null;
        String uri = null;
        String[] t = null;
        HttpSession session = null;
        
        session = request.getSession();
        uri = request.getRequestURI();
        if (uri.substring(0, 1).equals("/"))
            uri = uri.substring(1);
        if (uri.substring(uri.length() - 1).equals("/"))
            uri = uri.substring(0, uri.length() - 1);
        t = uri.split("/");

        if(t.length >= 4 || t[3].equals("attached")){ // 첨부파일 모드

        }else{ // 자료실 게시글 번호 모드

        }
        
        return result;
    } // End of fileBox
    
    @RequestMapping(value="/filebox/**", method=RequestMethod.DELETE)
    public String fileboxOptionDelete(HttpServletRequest request) {
        String result = null;
        String uri = null;
        String[] t = null;
        HttpSession session = null;
        
        session = request.getSession();
        uri = request.getRequestURI();
        if (uri.substring(0, 1).equals("/"))
            uri = uri.substring(1);
        if (uri.substring(uri.length() - 1).equals("/"))
            uri = uri.substring(0, uri.length() - 1);
        t = uri.split("/");

        if(t.length >= 4 || t[3].equals("attached")){ // 첨부파일 모드

        }else{ // 자료실 게시글 번호 모드

        }
        
        return result;
    } // End of fileBox
}


