package kr.co.bizcore.v1.ctrl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ApiCtrl extends Ctrl {

    @RequestMapping(value = "/dept", method = RequestMethod.GET)
    public String deptGet() {

        return null;
    } // End of dept

    @RequestMapping(value = "/dept", method = RequestMethod.POST)
    public String deptPost() {

        return null;
    } // End of dept

    @RequestMapping("/customer")
    public String customer(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/product")
    public String product(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/schedule")
    public String schedule(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/calendar")
    public String calendar(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/sales")
    public String sales(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/contract")
    public String contract(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/support")
    public String support(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/procure")
    public String procure(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/filebox")
    public String filebox(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/hr")
    public String hr(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/appr")
    public String appr(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/form")
    public String form(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/docbox")
    public String docbox(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/bankacc")
    public String bankacc(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/card")
    public String card(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/common")
    public String common(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/my")
    public String my(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/vacation")
    public String vacation(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/accslip")
    public String accslip(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/workreport")
    public String workreport(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

    @RequestMapping("/bbs")
    public String bbs(HttpServletRequest request, HttpServletResponse response) {

        return null;
    }

}
