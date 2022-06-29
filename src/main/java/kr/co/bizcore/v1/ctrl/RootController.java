package kr.co.bizcore.v1.ctrl;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class RootController extends Ctrl {

    @RequestMapping("test")
    public String test() {
        return systemService.test();
    }

}
