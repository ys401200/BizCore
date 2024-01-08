package kr.co.bizcore.v1.ctrl;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.FileInputStream;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping(value = "/", method = RequestMethod.GET)
@Slf4j
public class RootController extends Ctrl {
    private static final Logger logger = LoggerFactory.getLogger(RootController.class);
    private static final String VIEW_PATH = null;
    private static final String VIEW_ERROR_PATH = "/error/";

	// 로그인 여부에 따라 다른 페이지를 보여줌
    @RequestMapping("")
    public String root(HttpServletRequest request) {
        HttpSession session = null;
        String result = null, userNo = null;

        session = request.getSession();
        session.setAttribute("pathName", "root");
        userNo = (String) session.getAttribute("userNo");

        if (userNo != null) {
            result = "bodyContents";
        } else {
            result = "/login/login";
        }
        return result;
    } // End of root

    @RequestMapping(value = "/error")
    public String handleError(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);

        if(status != null){
            int statusCode = Integer.valueOf(status.toString());

            if(statusCode == HttpStatus.NOT_FOUND.value()){
                return VIEW_ERROR_PATH + "404";
            }
            if(statusCode == HttpStatus.FORBIDDEN.value()){
                return VIEW_ERROR_PATH + "500";
            }
        }
        return "error";
    }

    @RequestMapping(value = "/favicon", produces = MediaType.IMAGE_PNG_VALUE)
    public @ResponseBody byte[] favicon(HttpServletRequest request) throws IOException{
        byte[] result = null;
        FileInputStream reader = null;
        String compId = null;
        HttpSession session = null;
        String path = systemService.fileStoragePath, s = File.separator, faviconPath = null;

        session = request.getSession();
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");
        if(compId == null)  compId = "vtek";

        faviconPath = path + s + compId + s + "favicon.png";
        reader = new FileInputStream(faviconPath);
        result = reader.readAllBytes();
        
        return result;
    }
}
