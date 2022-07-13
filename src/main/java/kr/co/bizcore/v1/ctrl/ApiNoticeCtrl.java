package kr.co.bizcore.v1.ctrl;


import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import kr.co.bizcore.v1.domain.Notice;
import kr.co.bizcore.v1.svc.NoticeSvc;



@RestController
@RequestMapping("api/notice")
public class ApiNoticeCtrl extends Ctrl{
 
  @Autowired
  private NoticeSvc noticeSvc;
    @RequestMapping(value = "", method = RequestMethod.GET)
    public String get(HttpServletRequest request) {
        String result = null, data = null, aesKey = null, aesIv = null;
        HttpSession session = null;
        String compId = null;
        int i = 0;
        
        session = request.getSession();
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String) request.getAttribute("compId");

        if(compId != null){
            List<Notice> list = noticeSvc.getPostList(compId);
            if(list != null){
                data = "[";
                for(i = 0 ; i < list.size(); i++) {
                    if(i > 0)  data  += ",";
                    data += list.get(i).toJson();
                }
                data += "]";
                
            }else{
                data = "[]";
            }
            data = noticeSvc.encAes(data, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
        }else    result = "{\"result\":\"failure\",\"msg\":\"Company ID is not verified.\"}";
        
        return result;
    } // End of /api/notice  === get

    @RequestMapping(value = "/*", method = RequestMethod.DELETE)
    public String delete(HttpServletRequest req)  {
        
        HttpSession session = null;
        String compId = null;
        String result = null; 
        String notiNo = null;
        String uri = req.getRequestURI();
        String[] t = null;
        int num = 0;

        if(uri.substring(0, 1).equals("/")) uri = uri.substring(1);
        if(uri.substring(uri.length() - 1).equals("/")) uri = uri.substring(0, uri.length() - 1);
        t = uri.split("/");

        // 글 번호 확인
        if(t.length < 3){ // 글 번호 확인 안됨
            result = "{\"result\":\" failure\",\"msg\":\"notiNo is not exist\"}";
        }else{ // 글 번호 확인 됨
            notiNo = t[2];
            session = req.getSession();
            compId = (String)session.getAttribute("compId");
            if(compId == null)  compId=(String) req.getAttribute("compId");

            if(compId == null){ // 회사코드 확인 안됨
                result = "{\"result\":\" failure\",\"msg\":\"Company ID is not verified.\"}";
            }else{ // 회사코드 확인 됨
                num = noticeSvc.delete(compId, notiNo); // 삭제(update) 카운트를 실제 삭제 여부를 확인함
                if (num > 0) { // 처리됨
                    result = "{\"result\":\"ok\"}";
                } else { // 처리 안됨
                    result = "{\"result\":\" failure\",\"msg\":\"Error occured when delete.\"}";
                }// End of if : 3
            }// End of if : 2
        } // End of if : 1
        return result;
    } // End of /api/notice/*  === delete
   



   @RequestMapping(value = "/*", method=RequestMethod.GET)
   public String getDetail(HttpServletRequest req) {
    HttpSession session = null;
    String compId = null;
    String result = null; 
    String data = null;
    String notiNo = null;
    String uri = req.getRequestURI();
    String[] t = null;
    Notice notice = null;


    if(uri.substring(0, 1).equals("/")) uri = uri.substring(1);
    if(uri.substring(uri.length() - 1).equals("/")) uri = uri.substring(0, uri.length() - 1);
    t = uri.split("/");


    if(t.length < 3){ // 글 번호 확인 안됨
        result = "{\"result\":\" failure\",\"msg\":\"notiNo is not exist\"}";
    }else{ // 글 번호 확인 됨
        notiNo = t[2];
        session = req.getSession();
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId=(String) req.getAttribute("compId");

        if(compId == null){ // 회사코드 확인 안됨
            result = "{\"result\":\" failure\",\"msg\":\"Company ID is not verified.\"}";
        }else{ // 회사코드 확인 됨
            notice = noticeSvc.getNotice(compId, notiNo); // 삭제(update) 카운트를 실제 삭제 여부를 확인함
         
            if (notice != null) { // 처리됨
             data =  notice.toJson();

             result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
            
            } else { // 처리 안됨
                result = "{\"result\":\" failure\",\"msg\":\"Error occured when read.\"}";
            }// End of if : 3
        }// End of if : 2
    } // End of if : 1
    return result;
   }




   @RequestMapping(value="/*", method = RequestMethod.POST)
   public String insert(HttpServletRequest req , @RequestBody String requestBody) {
   
    String compId = null;
    String writer = null; 
    String title = null;
    String content = null; 
    HttpSession session = null;
    String result = null; 
    String data = null, aesKey = null, aesIv = null;
    JSONObject json = null;
    int check = 0;
    
    session = req.getSession();

    aesKey = (String)session.getAttribute("aesKey");
    aesIv = (String)session.getAttribute("aesIv");
    data = noticeSvc.decAes(requestBody, aesKey, aesIv);
    json = new JSONObject(data);

   
    compId = (String)session.getAttribute("compId");
    if(compId == null)  compId=(String) req.getAttribute("compId");
    
   
    writer = (String)session.getAttribute("userNo");
    if(writer == null) writer=(String) req.getAttribute("userNo");
    
    
    title = json.getString("title");
    if(title == null) result = "{\"result\":\" failure\" ,\"msg\":\"Title is not entered.\"}";

    content =json.getString("content");
    if(content == null) result = "{\"result\":\" failure\" ,\"msg\":\"Content is not entered.\"}";
    check = noticeSvc.insertNotice(compId, writer, title, content); 
   
    if(check > 0) {// 공지사항 추가 성공 
        result = "{\"result\":\" success\"}";
    } else { // 공지사항 추가 실패 
        result = "{\"result\":\" failure\" ,\"msg\":\"Error occured when write.\"}";
    }
 
    return result;

   }


   
/**
 * @param req
 * @param data
 * @return
 */
    @RequestMapping(value = "/*", method = RequestMethod.PUT)
    public String update(HttpServletRequest req, @RequestBody String requestBody) {
    String title = null;
    String content = null;
    String compId = null;
    String notiNo = null;
    String result = null; 
    HttpSession session = null;
    String data = null, aesKey = null, aesIv = null;
    String uri = req.getRequestURI();
    String [] t = null;
    JSONObject json = null;

    session = req.getSession();
    compId=(String) session.getAttribute("compId");
    if(compId == null) {
    compId= (String) req.getAttribute("compId"); 
    } 


    if(uri.substring(0, 1).equals("/")) uri = uri.substring(1);
    if(uri.substring(uri.length() - 1).equals("/")) uri = uri.substring(0, uri.length() - 1);
    t = uri.split("/");

    aesKey = (String)session.getAttribute("aesKey");
    aesIv = (String)session.getAttribute("aesIv");
    data = noticeSvc.decAes(requestBody, aesKey, aesIv);
    json = new JSONObject(data);



    if(t.length < 3 ) result = "{\"result\":\" failure\",\"msg\":\"notiNo is not exist\"}";
        else notiNo = t[2];


    if (json.getString("title") != null ) title = json.getString("title");
        else  result = "{\"result\":\" failure\",\"msg\":\"title is not exist\"}";


    if(json.getString("content") != null) content = json.getString("content");
        else  result = "{\"result\":\" failure\",\"msg\":\"content is not exist\"}";

    if(noticeSvc.updateNotice(title, content, compId, notiNo) > 0 ){
        result = "{\"result\":\" ok\"}";
    }

        
    return result; 


}





} // End of Class
