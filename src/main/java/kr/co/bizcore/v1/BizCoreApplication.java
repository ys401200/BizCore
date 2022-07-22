package kr.co.bizcore.v1;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.ApplicationPidFileWriter;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
@MapperScan("kr.co.bizcore.v1.mapper")
public class BizCoreApplication extends SpringBootServletInitializer{

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder app){
		return app.sources(BizCoreApplication.class);
	}

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(BizCoreApplication.class);
		app.addListeners(new ApplicationPidFileWriter());
		app.run(args);
	}

}
