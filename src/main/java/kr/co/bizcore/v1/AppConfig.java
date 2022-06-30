package kr.co.bizcore.v1;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import kr.co.bizcore.v1.util.Utility;

@Configuration
public class AppConfig {

    @Bean
    public Utility getUtility() {
        return new Utility();
    }

}
