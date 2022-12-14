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

import kr.co.bizcore.v1.msg.Msg;
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
        return sendFileList(request, "contract", no);
    }

    @GetMapping("/docapp/{no:\\d+}")
    public String apiAttachedDocappListGet(HttpServletRequest request, HttpServletResponse response, @PathVariable("no") int no){
        return sendFileList(request, "appDoc", no);
    }

    //@GetMapping("/filebox/{no:\\d+}/{fileName}")
    public String apiAttachedFileboxListGet(HttpServletRequest request, HttpServletResponse response, @PathVariable("no") int no){
        return sendFileList(request, "sopp", no);
    }

    private String sendFileList(HttpServletRequest request, String funcName, int funcNo){
        HttpSession session = null;
        String compId = null, result = null, data = null, aesKey = null, aesIv = null, lang = null;
        Msg msg = null;
        
        session = request.getSession();
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        lang = (String)session.getAttribute("lang");
        msg = getMsg(lang);
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else{
            data = attachedService.getAttachedFileList(compId, funcName, funcNo);
            if(data == null){
                result = "{\"result\":\"failure\",\"msg\":\"" + msg.unknownError + "\"}";
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
        sendFileData(request, response, "appDoc", no, fileName);
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
        logger.info("+++++++++++++++++++++ 파일 다운로드 " + funcName + " / " + funcNo + " / " + fileName);
        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");
        logger.info("+++++++++++++++++++++ 파일 다운로드 : compId : " + compId);
        if(compId == null){
            response.setStatus(404);
        }else{
            data = attachedService.getAttachedFileData(compId, funcName, funcNo, fileName);
            if(data == null){
                logger.info("+++++++++++++++++++++ 파일 다운로드 : data is null ? " + (data == null));
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
    @PostMapping("/supplied/{no:\\d+}")
    public String apiAttachedSuppliedPost(HttpServletRequest request, @RequestBody String requestBody, @PathVariable int no){
        return proceedAttachedData(request, requestBody, "supplied", no);
    }
    @PostMapping("/approved/{no:\\d+}")
    public String apiAttachedApprovedPost(HttpServletRequest request, @RequestBody String requestBody, @PathVariable int no){
        return proceedAttachedData(request, requestBody, "approved", no);
    }

    @PostMapping("/docapp")
    public String apiAttachedDocappPost(HttpServletRequest request, @RequestBody String requestBody){
        return proceedAttachedData(request, requestBody, "appDoc", 0);
    }

    //@GetMapping("/filebox")
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
        String lang = null;
        HttpSession session = null;
        Msg msg = null;
        HashMap<String, String> attached = null;
        String[] data = null;
        String t = null;
        byte[] fileData = null;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        lang = (String)session.getAttribute("lang");
        msg = getMsg(lang);
        attached = (HashMap<String, String>)session.getAttribute("attached");
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            data = requestBody.split("\r\n");
            if(data != null && data.length >= 2){
                fileName = data[0];
                file = data[1];
                t = decAes(file, aesKey, aesIv);
                fileData = Base64.getDecoder().decode(t);

                // 임시파일 처리가 필요한 경우 / 파일 선 첨부, 후 본문 게시 형태
                if(funcName.equals("appDoc") || funcName.equals("filebox")){
                    savedName = attachedService.saveAttachedToTemp(compId, fileData);
                    if(attached == null){
                        attached = new HashMap<>();
                        session.setAttribute("attached", attached);
                    }
                    attached.put(fileName, savedName);
                    result = "{\"result\":\"ok\",\"msg\":\"" + savedName + "\"}";
                }else{ // 임시파일 처리가 불필요한 경우 / 선 본문 게시 후 파일 첨부 형태
                    savedName = systemService.createRandomFileName();
                    if(attachedService.saveAttachedFile(compId, fileName, savedName, fileData, funcName, funcNo)){
                        result = "{\"result\":\"ok\",\"msg\":\"" + savedName + "\"}";
                    }else   result = "{\"result\":\"failure\",\"msg\":\"" + msg.unknownError + "\"}";
                }
            }
        }

        return result;
    } // End of proceedAttachedData()

    @DeleteMapping("/sopp/{no:\\d+}/{fileName}")
    public String apiAttachedSoppPost(HttpServletRequest request, @PathVariable("no") int no, @PathVariable("fileName") String fileName){
        return deleteAttachedFile(request, "sopp", no, fileName);
    }

    @DeleteMapping("/contract/{no:\\d+}/{fileName}")
    public String apiAttachedContractPost(HttpServletRequest request, @PathVariable("no") int no, @PathVariable("fileName") String fileName){
        return deleteAttachedFile(request, "contract", no, fileName);
    }

    @DeleteMapping("/supplied/{no:\\d+}/{fileName}")
    public String apiAttachedsuppliedPost(HttpServletRequest request, @PathVariable("no") int no, @PathVariable("fileName") String fileName){
        return deleteAttachedFile(request, "supplied", no, fileName);
    }

    @DeleteMapping("/approved/{no:\\d+}/{fileName}")
    public String apiAttachedapprovedPost(HttpServletRequest request, @PathVariable("no") int no, @PathVariable("fileName") String fileName){
        return deleteAttachedFile(request, "approved", no, fileName);
    }


    @DeleteMapping("/docapp/{no:\\d+}/{fileName}")
    public String apiAttachedDocappPost(HttpServletRequest request, @PathVariable("no") int no, @PathVariable("fileName") String fileName){
        return deleteAttachedFile(request, "appDoc", no, fileName);
    }

    //@DeleteMapping("/filebox/{no:\\d+}/{fileName}")
    public String apiAttachedFileboxPost(HttpServletRequest request, @PathVariable("no") int no, @PathVariable("fileName") String fileName){
        return deleteAttachedFile(request, "filebox", no, fileName);
    }

    private String deleteAttachedFile(HttpServletRequest request, String funcName, int no, String fileName) {
        String result = null, compId = null, data = null, aesIv = null, aesKey = null, lang = null;
        HttpSession session = null;
        Msg msg = null;
        int v = -1;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        aesKey = (String)session.getAttribute("aesKey");
        aesIv = (String)session.getAttribute("aesIv");
        lang = (String)session.getAttribute("lang");
        msg = getMsg(lang);
        if(compId == null)  compId = (String)request.getAttribute("compId");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compIdNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            v = attachedService.deleteAttachedFile(compId, funcName, no, fileName);
            if(v == 0){
                data = attachedService.getAttachedFileList(compId, funcName, no);
                data = encAes(data, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
            }else if( v == -1)   result = "{\"result\":\"failure\",\"msg\":\"" + msg.unknownError + "\"}";
            else    result = "{\"result\":\"failure\",\"msg\":\"" + msg.fileNotFound + "\"}";
        }
        return result;
    }
    
}
