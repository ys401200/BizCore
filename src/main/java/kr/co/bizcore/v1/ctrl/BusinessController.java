package kr.co.bizcore.v1.ctrl;

import javax.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/business")
@Slf4j
public class BusinessController extends Ctrl {

    private static final Logger logger = LoggerFactory.getLogger(BusinessController.class);

    @RequestMapping(value = { "/notice", "/notice/{no:\\d+}" })
    public String notice(HttpServletRequest request) {
        doIt(request);
        return "/notice/list";
    } // End of /business/**

    @RequestMapping(value = { "/schedule", "/schedule/{no:\\d+}" })
    public String schedule(HttpServletRequest request) {
        doIt(request);
        return "/schedule/schedule";
    } // End of /business/**

    @RequestMapping(value = { "/sales", "/sales/{no:\\d+}" })
    public String sales(HttpServletRequest request) {
        doIt(request);
        return "/sales/list";
    } // End of /business/**

    @RequestMapping(value = { "/sopp", "/sopp/{no:\\d+}" })
    public String sopp(HttpServletRequest request) {
        doIt(request);
        return "/sopp/list";
    } // End of /business/**

    @RequestMapping("/project")
    public String project(HttpServletRequest request) {
        doIt(request);
        return "/project/list";
    } // End of /business/**

    @RequestMapping("/sopp2/{no:\\d+}")
    public String projectSopp(HttpServletRequest request) {
        doIt(request);
        return "/project/sopp";
    } // End of /business/**

    @RequestMapping("/est")
    public String est(HttpServletRequest request) {
        doIt(request);
        return "/est/list";
    } // End of /business/**

    @RequestMapping(value = { "/contract", "/contract/{no}" })
    public String cont(HttpServletRequest request) {
        doIt(request);
        return "/contract/list";
    } // End of /business/**

    @RequestMapping(value = { "/contract2", "/contract2/{no:\\d+}" })
    public String cont2(HttpServletRequest request) {
        doIt(request);
        return "/contract/contract2";
    }

    @RequestMapping(value = { "/contract/popup/{docNo}" })
    public String setprint(HttpServletRequest request) {
        doIt(request);
        return "/contract/popup";
    }

    @RequestMapping(value = { "/tech", "/tech/{no:\\d+}" })
    public String tech(HttpServletRequest request) {
        doIt(request);
        return "/tech/list";
    } // End of /business/**

    @RequestMapping("/filebox")
    public String filebox(HttpServletRequest request) {
        doIt(request);
        return "/filebox/filebox";
    } // End of /filebox/**

    @RequestMapping("/workreport")
    public String workreport(HttpServletRequest request) {
        doIt(request);
        return "/workreport/workreport";
    } // End of /business/**

    @RequestMapping(value = { "/estimate", "/estimate/{no}" })
    public String estimate(HttpServletRequest request) {
        doIt(request);
        return "/business/estimate";
    } // End of /business/**

    @RequestMapping("/workjournal")
    public String workjournal(HttpServletRequest request) {
        doIt(request);
        return "/workreport/workjournal";
    } // End of /business/**

    @RequestMapping("/goal")
    public String goal(HttpServletRequest request) {
        doIt(request);
        return "/goal/list";
    } // End of /business/**

    @RequestMapping(value = { "/customer", "/customer/{no:\\d+}" })
    public String customer(HttpServletRequest request) {
        doIt(request);
        return "/customer/list";
    } // End of /business/**

    @RequestMapping("/employee")
    public String employee(HttpServletRequest request) {
        doIt(request);
        return "/business/employee";
    } // End of /business/**

    @RequestMapping("/product")
    public String product(HttpServletRequest request) {
        doIt(request);
        return "/product/list";
    } // End of /business/**

    @RequestMapping("/popupEstForm")
    public String popupEstForm(HttpServletRequest request) {
        doIt(request);
        return "/business/popupEstForm";
    } // End of /business/**
}
