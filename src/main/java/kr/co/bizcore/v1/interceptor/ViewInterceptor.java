package kr.co.bizcore.v1.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import kr.co.bizcore.v1.svc.SystemService;

@Component
public class ViewInterceptor implements HandlerInterceptor {

    @Autowired
    SystemService systemService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        String server = request.getServerName();
        String compId = systemService.findCompIdFromConnUrl(server);
        if (compId != null)
            request.setAttribute("compId", compId);
        return HandlerInterceptor.super.preHandle(request, response, handler);
    }

}