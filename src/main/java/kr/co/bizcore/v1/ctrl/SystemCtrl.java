package kr.co.bizcore.v1.ctrl;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/system")
public class SystemCtrl extends Ctrl {

    @RequestMapping(value = "/connUrl", method = RequestMethod.GET)
    public String connUrl() {
        return systemService.getConnUrl();
    } // End of connUrl()

}
