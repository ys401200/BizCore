package kr.co.bizcore.v1;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("kr.co.bizcore.v1.mapper")
public class BizCoreApplication {

	public static void main(String[] args) {
		SpringApplication.run(BizCoreApplication.class, args);
	}

}
