package kr.co.bizcore.v1.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import kr.co.bizcore.v1.msg.Msg;
import kr.co.bizcore.v1.msg.MsgEng;
import kr.co.bizcore.v1.msg.MsgKor;
import kr.co.bizcore.v1.svc.SystemService;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class ViewInterceptor implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(ViewInterceptor.class);

    @Autowired
    private SystemService systemService;

    @Value("${bizcore.server.debug}")
    private String debug;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        String server = null;
        String compId = null;
        String userNo = null;
        String uri = null;
        HttpSession session = request.getSession();
        String lang1 = (String)session.getAttribute("lang");
        String lang2 = request.getHeader("Accept-Language");

        if(lang2 != null && lang2.toLowerCase().indexOf("ko-kr") >= 0)   lang2 = "ko-kr";

        if(lang1 == null && lang2 != null){
            session.setAttribute("lang", lang2.toLowerCase());
            lang1 = lang2.toLowerCase();
        }
        
        Msg msg = (lang1 == null) ? new MsgEng() : lang1.toLowerCase().equals("ko-kr") ? new MsgKor() : new MsgEng();

        server = request.getServerName();
        uri = request.getRequestURI();
        userNo = (String)request.getSession().getAttribute("userNo");

        if (debug.equals("true"))   compId = "vtek"; // for Dev
        else    compId = systemService.findCompIdFromConnUrl(server);

        if (compId != null)
            request.setAttribute("compId", compId);

        if(uri.length() >= 4 && uri.substring(0, 4).equals("/api") && userNo == null &&
                        !(uri.length() >= 15 && uri.substring(0, 15).equals("/api/user/login")) &&
                        !(uri.length() >= 13 && uri.substring(0, 13).equals("/api/user/rsa")) &&
                        !(uri.length() >= 14 && uri.substring(0, 14).equals("/api/user/keep")) &&
                        !(uri.length() >= 13 && uri.substring(0, 13).equals("/api/user/aes"))){
            response.getWriter().print("{\"result\":\"failure\",\"msg\":\"" + msg.notLoggedin + "\"}");
            return false;
        }else if(uri.length() >= 9 && uri.substring(0, 9).equals("/business") && userNo == null){
            response.sendRedirect("/");
            return false;
        }else if(uri.length() >= 3 && uri.substring(0, 3).equals("/gw") && userNo == null){
            response.sendRedirect("/");
            return false;
        }else if(uri.length() >= 4 && uri.substring(0, 4).equals("/mis") && userNo == null){
            response.sendRedirect("/");
            return false;
        }else if(uri.length() >= 11 && uri.substring(0, 11).equals("/accounting") && userNo == null){
            response.sendRedirect("/");
            return false;
        }
        return HandlerInterceptor.super.preHandle(request, response, handler);
    }

}