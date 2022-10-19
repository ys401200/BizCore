package kr.co.bizcore.v1.ctrl;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.UUID;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import kr.co.bizcore.v1.domain.SimpleUser;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/business")
@Slf4j
public class BusinessController extends Ctrl{

    private static final Logger logger = LoggerFactory.getLogger(BusinessController.class);

    @RequestMapping(value="/imageUpload", method = RequestMethod.POST)
    public void imageUpload(HttpServletRequest request, HttpServletResponse response, MultipartHttpServletRequest multiFile, @RequestParam MultipartFile upload) throws Exception{
        UUID uid = UUID.randomUUID();
        OutputStream out = null;
        PrintWriter printWriter = null;
        
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html;charset=utf-8");
        
        try{
            String fileName = upload.getOriginalFilename();
            byte[] bytes = upload.getBytes();
            String path = "C:\\BizUpload\\editorUpload\\";
            String ckUploadPath = path + uid + "_" + fileName;
            File folder = new File(path);
            
            if(!folder.exists()){
                try{
                    folder.mkdirs();
                }catch(Exception e){
                    e.getStackTrace();
                }
            }
            
            out = new FileOutputStream(new File(ckUploadPath));
            out.write(bytes);
            out.flush();
            
            printWriter = response.getWriter();
            String fileUrl = "/business/imageSubmit?uid=" + uid + "&fileName=" + fileName;
            
          printWriter.println("{\"filename\" : \""+fileName+"\", \"uploaded\" : 1, \"url\":\""+fileUrl+"\"}");
          printWriter.flush();
            
        }catch(IOException e){
            e.printStackTrace();
        } finally {
          try {
           if(out != null) { out.close(); }
           if(printWriter != null) { printWriter.close(); }
          } catch(IOException e) { e.printStackTrace(); }
         }
        
        return;
    }

    @RequestMapping(value="/imageSubmit")
    public void ckSubmit(@RequestParam(value="uid") String uid, @RequestParam(value="fileName") String fileName, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
        String path = "C:\\BizUpload\\editorUpload\\";
        String sDirPath = path + uid + "_" + fileName;
        File imgFile = new File(sDirPath);
        
        if(imgFile.isFile()){
            byte[] buf = new byte[1024];
            int readByte = 0;
            int length = 0;
            byte[] imgBuf = null;
            FileInputStream fileInputStream = null;
            ByteArrayOutputStream outputStream = null;
            ServletOutputStream out = null;
            
            try{
                fileInputStream = new FileInputStream(imgFile);
                outputStream = new ByteArrayOutputStream();
                out = response.getOutputStream();
                
                while((readByte = fileInputStream.read(buf)) != -1){
                    outputStream.write(buf, 0, readByte);
                }
                
                imgBuf = outputStream.toByteArray();
                length = imgBuf.length;
                out.write(imgBuf, 0, length);
                out.flush();
                
            }catch(IOException e){
                e.printStackTrace();
            }finally {
                outputStream.close();
                fileInputStream.close();
                out.close();
            }
        }
    }

    @RequestMapping(value={"/notice","/notice/{no:\\d+}"})
    public String notice(HttpServletRequest request) {
        doIt(request);
        return "/notice/list";
    } // End of /business/**

    @RequestMapping(value={"/schedule","/schedule/{no:\\d+}"})
    public String schedule(HttpServletRequest request) {
        doIt(request);
        return "/schedule/schedule";
    } // End of /business/**

    @RequestMapping(value={"/sales","/sales/{no:\\d+}"})
    public String sales(HttpServletRequest request) {
        doIt(request);
        return "/sales/list";
    } // End of /business/**

    @RequestMapping(value={"/sopp","/sopp/{no:\\d+}"})
    public String sopp(HttpServletRequest request) {
        doIt(request);
        return "/sopp/list";
    } // End of /business/**

    @RequestMapping("/est")
    public String est(HttpServletRequest request) {
        doIt(request);
        return "/est/list";
    } // End of /business/**

    @RequestMapping(value={"/contract","/contract/{no:\\d+}"})
    public String cont(HttpServletRequest request) {
        doIt(request);
        return "/contract/list";
    } // End of /business/**

    @RequestMapping(value={"/tech","/tech/{no:\\d+}"})
    public String tech(HttpServletRequest request) {
        doIt(request);
        return "/tech/list";
    } // End of /business/**

    @RequestMapping("/filebox")
    public String filebox(HttpServletRequest request) {
        doIt(request);
        return "/filebox/filebox";
    } // End of /filebox/**

    @RequestMapping("/workreport")
    public String workreport(HttpServletRequest request) {
        doIt(request);
        return "/workreport/workreport";
    } // End of /business/**

    @RequestMapping("/estimate")
    public String estimate(HttpServletRequest request) {
        doIt(request);
        return "/business/estimate";
    } // End of /business/**

    @RequestMapping("/workjournal")
    public String workjournal(HttpServletRequest request) {
        doIt(request);
        return "/workreport/workjournal";
    } // End of /business/**

    @RequestMapping("/goal")
    public String goal(HttpServletRequest request) {
        doIt(request);
        return "/goal/list";
    } // End of /business/**

    @RequestMapping(value={"/customer", "/customer/{no:\\d+}"})
    public String customer(HttpServletRequest request) {
        doIt(request);
        return "/customer/list";
    } // End of /business/**
}
