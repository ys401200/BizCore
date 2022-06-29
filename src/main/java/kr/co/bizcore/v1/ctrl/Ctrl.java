package kr.co.bizcore.v1.ctrl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Controller;

import kr.co.bizcore.v1.svc.SystemService;

@Controller
public abstract class Ctrl {

    @Autowired
    protected ApplicationContext applicationContext;

    @Autowired
    protected SystemService systemService;

}
