package kr.co.bizcore.v1;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import kr.co.bizcore.v1.interceptor.ViewInterceptor;

@Configuration
public class ViewConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(getViewInterceptor())
                .excludePathPatterns("*.css", "*.js", "*.png", "*.jpg");
    } // Enmd of addInterceptors()

    @Bean
    public ViewInterceptor getViewInterceptor() {
        return new ViewInterceptor();
    }

}
