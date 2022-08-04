package kr.co.bizcore.v1.ctrl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/gw")
@Slf4j
public class ApiGwCtrl extends Ctrl{

    private static final Logger logger = LoggerFactory.getLogger(ApiGwCtrl.class);

    public String apiGwFormGet(){
        String result = null;



        return result;
    } // End of apiGwFormGet()
    
}
