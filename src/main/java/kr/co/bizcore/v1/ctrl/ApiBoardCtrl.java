package kr.co.bizcore.v1.ctrl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMethod;


@RestController
@RequestMapping("/api/board")
public class ApiBoardCtrl extends Ctrl{

    @RequestMapping(value="/filebox", method=RequestMethod.GET)
    public String fileboxGet(HttpServletRequest request) {
        String result = null;
        
        
        
        return result;
    } // End of fileBoxGet()

    @RequestMapping(value="/filebox", method=RequestMethod.POST)
    public String fileboxPost(HttpServletRequest request, @RequestBody String requestBody) {
        String result = null;
        
        
        
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
        HttpSession session = null;
        
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

    @RequestMapping(value="/filebox/**", method=RequestMethod.POST)
    public String fileboxOptionPost(HttpServletRequest request, @RequestBody String requestBody) {
        String result = null;
        String uri = null;
        String[] t = null;
        HttpSession session = null;
        
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

    @RequestMapping(value="/filebox/**", method=RequestMethod.PUT)
    public String fileboxOptionPut(HttpServletRequest request, @RequestBody String requestBody) {
        String result = null;
        String uri = null;
        String[] t = null;
        HttpSession session = null;
        
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


