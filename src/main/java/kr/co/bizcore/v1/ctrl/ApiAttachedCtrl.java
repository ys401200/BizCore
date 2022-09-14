package kr.co.bizcore.v1.ctrl;

import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/attached")
@Slf4j
public class ApiAttachedCtrl extends Ctrl{

    private static final Logger logger = LoggerFactory.getLogger(ApiAttachedCtrl.class);

    @GetMapping("/sopp/{no:\\d+}")
    public String apiAttachedSoppListGet(HttpServletRequest request, HttpServletResponse response, @PathVariable("no") int no){
        return sendFileList(request, "sopp", no);
    }

    @GetMapping("/contract/{no:\\d+}")
    public String apiAttachedContractListGet(HttpServletRequest request, HttpServletResponse response, @PathVariable("no") int no){
        return sendFileList(request, "sopp", no);
    }

    @GetMapping("/docapp/{no:\\d+}")
    public String apiAttachedDocappListGet(HttpServletRequest request, HttpServletResponse response, @PathVariable("no") int no){
        return sendFileList(request, "sopp", no);
    }

    //@GetMapping("/filebox/{no:\\d+}/{fileName}")
    public String apiAttachedFileboxListGet(HttpServletRequest request, HttpServletResponse response, @PathVariable("no") int no){
        return sendFileList(request, "sopp", no);
    }

    private String sendFileList(HttpServletRequest request, String funcName, int funcNo){
        HttpSession session = null;
        String compId = null, result = null, data = null, aesKey = null, aesIv = null;
        
        session = request.getSession();
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else{
            data = attachedService.getAttachedFileList(compId, funcName, funcNo);
            if(data == null){
                result = "{\"result\":\"failure\",\"msg\":\"An error occurred.\"}";
            }else{
                data = encAes(data, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
            }
        }

        return result;
    } // End of sendFileList()

    @GetMapping("/sopp/{no:\\d+}/{fileName}")
    public void apiAttachedSoppGet(HttpServletRequest request, HttpServletResponse response, @PathVariable("no") int no, @PathVariable("fileName") String fileName){
        sendFileData(request, response, "sopp", no, fileName);
    }

    @GetMapping("/contract/{no:\\d+}/{fileName}")
    public void apiAttachedContractGet(HttpServletRequest request, HttpServletResponse response, @PathVariable("no") int no, @PathVariable("fileName") String fileName){
        sendFileData(request, response, "contract", no, fileName);
    }

    @GetMapping("/docapp/{no:\\d+}/{fileName}")
    public void apiAttachedDocappGet(HttpServletRequest request, HttpServletResponse response, @PathVariable("no") int no, @PathVariable("fileName") String fileName){
        sendFileData(request, response, "docApp", no, fileName);
    }

    //@GetMapping("/filebox/{no:\\d+}/{fileName}")
    public void apiAttachedFileboxGet(HttpServletRequest request, HttpServletResponse response, @PathVariable("no") int no, @PathVariable("fileName") String fileName){
        sendFileData(request, response, "filebox", no, fileName);
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
    } // End of sendFileData()

    @PostMapping("/sopp/{no:\\d+}")
    public String apiAttachedSoppPost(HttpServletRequest request, @RequestBody String requestBody, @PathVariable int no){
        return proceedAttachedData(request, requestBody, "sopp", no);
    }

    @PostMapping("/contract/{no:\\d+}")
    public String apiAttachedContractPost(HttpServletRequest request, @RequestBody String requestBody, @PathVariable int no){
        return proceedAttachedData(request, requestBody, "contract", no);
    }

    @PostMapping("/docapp/{no:\\d+}")
    public String apiAttachedDocappPost(HttpServletRequest request, @RequestBody String requestBody, @PathVariable int no){
        return proceedAttachedData(request, requestBody, "docApp", no);
    }

    //@GetMapping("/filebox/{no:\\d+}")
    public String apiAttachedFileboxPost(HttpServletRequest request, @RequestBody String requestBody, @PathVariable int no){
        return proceedAttachedData(request, requestBody, "filebox", no);
    }

    private String proceedAttachedData(HttpServletRequest request, String requestBody, String funcName, int funcNo){
        String result = null;
        String fileName = null;
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
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"Encryption key is not set.\"}";
        }else{
            data = requestBody.split("\r\n");
            if(data != null && data.length >= 2){
                fileName = data[0];
                file = data[1];
                t = decAes(file, aesKey, aesIv);
                fileData = Base64.getDecoder().decode(t);
                savedName = systemService.createRandomFileName();
                if(attachedService.saveAttachedFile(compId, fileName, savedName, fileData, funcName, funcNo)){
                    result = "{\"result\":\"ok\",\"msg\":\"" + savedName + "\"}";
                }else   result = "{\"result\":\"failure\",\"msg\":\"Error occurred when file save.\"}";
            }
        }

        return result;
    }

    @DeleteMapping("/sopp/{no:\\d+}/{fileName}")
    public String apiAttachedSoppPost(HttpServletRequest request, @PathVariable("no") int no, @PathVariable("fileName") String fileName){
        return deleteAttachedFile(request, "sopp", no, fileName);
    }

    @DeleteMapping("/contract/{no:\\d+}/{fileName}")
    public String apiAttachedContractPost(HttpServletRequest request, @PathVariable("no") int no, @PathVariable("fileName") String fileName){
        return deleteAttachedFile(request, "contract", no, fileName);
    }

    @DeleteMapping("/docapp/{no:\\d+}/{fileName}")
    public String apiAttachedDocappPost(HttpServletRequest request, @PathVariable("no") int no, @PathVariable("fileName") String fileName){
        return deleteAttachedFile(request, "docApp", no, fileName);
    }

    //@DeleteMapping("/filebox/{no:\\d+}/{fileName}")
    public String apiAttachedFileboxPost(HttpServletRequest request, @PathVariable("no") int no, @PathVariable("fileName") String fileName){
        return deleteAttachedFile(request, "filebox", no, fileName);
    }

    private String deleteAttachedFile(HttpServletRequest request, String funcName, int no, String fileName) {
        String result = null, compId = null, data = null, aesIv = null, aesKey = null;
        HttpSession session = null;
        int v = -1;

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
            v = attachedService.deleteAttachedFile(compId, funcName, no, fileName);
            if(v == 0){
                data = attachedService.getAttachedFileList(compId, funcName, no);
                data = encAes(data, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
            }else if( v == -1)   result = "{\"result\":\"failure\",\"msg\":\"An error occurred when file delete.\"}";
            else    result = "{\"result\":\"failure\",\"msg\":\"File not found Or removed.\"}";
        }
        return result;
    }
    
}
