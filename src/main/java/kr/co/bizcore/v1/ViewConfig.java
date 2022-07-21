package kr.co.bizcore.v1;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import kr.co.bizcore.v1.interceptor.ViewInterceptor;
import kr.co.bizcore.v1.svc.Svc;
import kr.co.bizcore.v1.util.UploadedFileStorage;

@Configuration
public class ViewConfig implements WebMvcConfigurer {

    @Value("${bizcore.storage.uploadedfile}")
    private String fileUploadedPath;

    @Value("${bizcore.server.debug}")
    private String debug;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        Svc.DEBUG = debug.equals("true");
        registry.addInterceptor(getViewInterceptor())
                .excludePathPatterns("*.css", "*.js", "*.png", "*.jpg");
    } // Enmd of addInterceptors()

    @Bean
    public ViewInterceptor getViewInterceptor() {
        return new ViewInterceptor();
    }

    @Bean
    public UploadedFileStorage getFileStorage(){
        return new UploadedFileStorage(fileUploadedPath);
    }

}
