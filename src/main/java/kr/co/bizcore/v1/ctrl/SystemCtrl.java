package kr.co.bizcore.v1.ctrl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/system")
@Slf4j
public class SystemCtrl extends Ctrl {

    private static final Logger logger = LoggerFactory.getLogger(SystemCtrl.class);

    @RequestMapping(value = "/connUrl", method = RequestMethod.GET)
    public String connUrl() {
        return systemService.getConnUrl();
    } // End of connUrl()

}
