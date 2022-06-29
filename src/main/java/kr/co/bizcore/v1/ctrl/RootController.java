package kr.co.bizcore.v1.ctrl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/", method = RequestMethod.GET)
public class RootController extends Ctrl {

    // 첫 화면 / 로그인 여부 및 compId 확인 여부에 따라 달리 나타나도록 함
    @RequestMapping("")
    public String root(HttpServletRequest request) {
        String compId = null, userNo = null;
        HttpSession session = null;

        session = request.getSession();
        compId = (String) session.getAttribute("compId");
        if (compId == null)
            request.getAttribute("compId");

        if (compId != null && userNo != null) { // 로그인 되어 있는 경우

            // CODE ====================================

        } else if (userNo == null && compId != null) { // 로그인 되어 있지 않은 경우 / compId 확인됨

            // CODE ====================================

        } else { // 로그인 되어 있지 않은 경우 / compId 확인 안됨

            // CODE ====================================

        }

        return null;
    }

}
