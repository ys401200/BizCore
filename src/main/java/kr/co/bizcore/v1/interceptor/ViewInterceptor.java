package kr.co.bizcore.v1.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import kr.co.bizcore.v1.svc.SystemService;

@Component
public class ViewInterceptor implements HandlerInterceptor {

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

        server = request.getServerName();
        uri = request.getRequestURI();
        userNo = (String)request.getSession().getAttribute("userNo");

        if (debug.equals("true"))   compId = "vtek"; // for Dev
        else    compId = systemService.findCompIdFromConnUrl(server);
        System.out.println("[TEST] :::::::::: DEBUG ? " + debug + " / compId :" + compId);
        if (compId != null)
            request.setAttribute("compId", compId);

        if(uri.length() >= 4 && uri.substring(0, 4).equals("/api") && userNo == null &&
                        !(uri.length() >= 15 && uri.substring(0, 15).equals("/api/user/login")) &&
                        !(uri.length() >= 13 && uri.substring(0, 13).equals("/api/user/rsa")) &&
                        !(uri.length() >= 13 && uri.substring(0, 13).equals("/api/user/aes"))){
            response.getWriter().print("{\"result\":\"failure\",\"msg\":\"Session is Expired and/or Not logged in.\"}");
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