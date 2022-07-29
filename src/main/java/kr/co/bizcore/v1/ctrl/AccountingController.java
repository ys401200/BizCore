package kr.co.bizcore.v1.ctrl;

import org.mybatis.logging.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/accounting")
@Slf4j
public class AccountingController {

    private static final org.mybatis.logging.Logger logger = LoggerFactory.getLogger(AccountingController.class);
    
}
