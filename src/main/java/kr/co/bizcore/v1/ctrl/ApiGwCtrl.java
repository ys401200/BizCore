package kr.co.bizcore.v1.ctrl;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/gw")
@Slf4j
public class ApiGwCtrl extends Ctrl{

    private static final Logger logger = LoggerFactory.getLogger(ApiGwCtrl.class);

    @GetMapping("/form")
    public String apiGwFormGet(HttpServletRequest request){
        String result = null, data = null, aesKey = null, aesIv = null;
        HttpSession session = null;
        String forms = null;
        int i = 0;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");

        forms = gwService.getForms();
        if (forms == null)  result = "{\"result\":\"failure\",\"msg\":\"Document forms Not Found.\"}";
        else{
            data = encAes(forms, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
        }

        return result;
    } // End of apiGwFormGet()

    @GetMapping("/form/{id}")
    public String apiGwFormGet(HttpServletRequest request, @PathVariable String formId){
        String result = null, data = null, aesKey = null, aesIv = null;
        HttpSession session = null;
        String form = null;

        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");

        form = gwService.getForm(formId);
        if (form == null)  result = "{\"result\":\"failure\",\"msg\":\"Document form Not Found.\"}";
        else{
            data = encAes(form, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
        }

        return result;
    } // End of apiGwFormGet()
    
}
