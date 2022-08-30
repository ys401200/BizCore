package kr.co.bizcore.v1.ctrl;

import java.io.IOException;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/attached")
public class ApiAttachedCtrl extends Ctrl{

    @GetMapping("/sopp/{no:\\d+}/{fileName}")
    public void apiAttachedSoppGet(HttpServletRequest request, @PathVariable("no") int no, @PathVariable("fileName") String fileName){
        String ognName = null;

    }

    @GetMapping("/contract/{no:\\d+}/{fileName}")
    public void apiAttachedContractGet(HttpServletRequest request, HttpServletResponse response, @PathVariable("no") int no, @PathVariable("fileName") String fileName){
        String ognName = null;
        
    }

    @GetMapping("/docapp/{no:\\d+}/{fileName}")
    public void apiAttachedDocappGet(HttpServletRequest request, HttpServletResponse response, @PathVariable("no") int no, @PathVariable("fileName") String fileName){
        String ognName = null;
        
    }

    @GetMapping("/filebox/{no:\\d+}/{fileName}")
    public void apiAttachedFileboxGet(HttpServletRequest request, HttpServletResponse response, @PathVariable("no") int no, @PathVariable("fileName") String fileName){
        String ognName = null;
        
    }

    private void sendFileData(HttpServletRequest request, HttpServletResponse response, String funcName, int funcNo, String fileName){
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
            data = attachedService.getAttachedFileData(compId, funcName, funcNo, fileName);
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
                    response.setContentLength(data.length);
                    
                    out = response.getOutputStream();
                    out.write(data);
                    out.flush();
                } catch (IOException e) {
                    response.setStatus(500);
                }
            }
        }
    }
    
}
