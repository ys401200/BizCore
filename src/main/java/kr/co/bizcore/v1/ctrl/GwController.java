package kr.co.bizcore.v1.ctrl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import kr.co.bizcore.v1.domain.SimpleUser;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/gw")
@Slf4j
public class GwController extends Ctrl{

    private static final Logger logger = LoggerFactory.getLogger(GwController.class);

    @RequestMapping(value = { "/wait", "/wait/{docNo}" }, method = RequestMethod.GET)
    public String mylist(HttpServletRequest request) {
        return doList(request);
    }

    @RequestMapping(value = { "/write", "/write/{docNo}" }, method = RequestMethod.GET)
    public String write(HttpServletRequest request) {
        doIt(request);
        return "/gw/write";
    }

    @RequestMapping(value = "/home", method = RequestMethod.GET)
    public String home(HttpServletRequest request) {
        doIt(request);
        return "/gw/home";
    }

    @RequestMapping(value = { "/due", "/due/{docNo}" }, method = RequestMethod.GET)
    public String due(HttpServletRequest request) {
        return doList(request);
    }

    @RequestMapping(value = { "/receive", "/receive/{docNo}" }, method = RequestMethod.GET)
    public String receive(HttpServletRequest request) {
        return doList(request);
    }

    @RequestMapping(value = { "/refer", "/refer/{docNo}" }, method = RequestMethod.GET)
    public String refer(HttpServletRequest request) {
        return doList(request);
    }

    @RequestMapping(value = { "/mydraft", "/mydraft/{docNo}" }, method = RequestMethod.GET)
    public String myDraft(HttpServletRequest request) {
        return doBox(request);
    }

    @RequestMapping(value = { "/mytemp", "/mytemp/{docNo}" }, method = RequestMethod.GET)
    public String mytemp(HttpServletRequest request) {
        return doBox(request);
    }

    @RequestMapping(value = "/myapp", method = RequestMethod.GET)
    public String myapp(HttpServletRequest request) {
        return doBox(request);
    }

    @RequestMapping(value = { "/myreceive", "/myreceive/{docNo}" }, method = RequestMethod.GET)
    public String myreceive(HttpServletRequest request) {
        return doBox(request);
    }

    @RequestMapping(value = { "/myrefer", "/myrefer/{docNo}" }, method = RequestMethod.GET)
    public String myrefer(HttpServletRequest request) {
        return doBox(request);
    }

    private String doList(HttpServletRequest request){
        doIt(request);
        return "/gw/list";
    }

    private String doBox(HttpServletRequest request){
        doIt(request);
        return "/gw/box";
    }
    @RequestMapping(value = { "/estimate" }, method = RequestMethod.GET)
    public String setEstimate(HttpServletRequest request) {
        doIt(request);
        return "/gw/estimate";
    }


}
