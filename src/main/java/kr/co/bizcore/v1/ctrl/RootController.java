package kr.co.bizcore.v1.ctrl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/", method = RequestMethod.GET)
public class RootController extends Ctrl {

    // 泥� �솕硫� / 濡쒓렇�씤 �뿬遺� 諛� compId �솗�씤 �뿬遺��뿉 �뵲�씪 �떖由� �굹���굹�룄濡� �븿
    @RequestMapping("")
    public String root(HttpServletRequest request) {
        String compId = null, userNo = null;
        HttpSession session = null;

        session = request.getSession();
        compId = (String) session.getAttribute("compId");
        if (compId == null)
            request.getAttribute("compId");

        if (compId != null && userNo != null) { // 濡쒓렇�씤 �릺�뼱 �엳�뒗 寃쎌슦

            // CODE ====================================

        } else if (userNo == null && compId != null) { // 濡쒓렇�씤 �릺�뼱 �엳吏� �븡�� 寃쎌슦 / compId �솗�씤�맖

            // CODE ====================================

        } else { // 濡쒓렇�씤 �릺�뼱 �엳吏� �븡�� 寃쎌슦 / compId �솗�씤 �븞�맖

            // CODE ====================================

        }

        return "/bodyContents";
    }

}
