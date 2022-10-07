package kr.co.bizcore.v1.ctrl;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("manage")
@Slf4j
public class ManageCtrl extends Ctrl{

    private static final Logger logger = LoggerFactory.getLogger(ManageCtrl.class);

    @GetMapping("") //
    public String name(HttpServletRequest request){
        doIt(request);
        return "";
    }
    
}
