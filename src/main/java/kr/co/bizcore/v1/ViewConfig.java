package kr.co.bizcore.v1;

import java.io.File;
import java.io.IOException;
import java.util.List;

import javax.sql.DataSource;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import ch.qos.logback.classic.Logger;
import kr.co.bizcore.v1.interceptor.ViewInterceptor;
import kr.co.bizcore.v1.svc.Svc;
import kr.co.bizcore.v1.svc.SystemService;
import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class ViewConfig implements WebMvcConfigurer {

    private static final org.slf4j.Logger logger = LoggerFactory.getLogger(ViewConfig.class);

    @Autowired
    ResourceLoader resourceLoader;

    @Autowired
    private SystemService systemService;

    @Value("${bizcore.storage.uploadedfile}")
    private String fileSavePath;

    @Value("${bizcore.server.debug}")
    private String debug;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(getViewInterceptor())
                .excludePathPatterns("*.css", "*.js", "*.png", "*.jpg");
        appInitialize();
    } // Enmd of addInterceptors()

    @Bean
    public ViewInterceptor getViewInterceptor() {
        return new ViewInterceptor();
    }

    @Bean
    public PlatformTransactionManager txMng(@Autowired DataSource ds) throws Exception{
        return new DataSourceTransactionManager(ds);
    }

    private void appInitialize(){

        String rootPath = null, compId = null, s = File.separator, t = null;;
        List<String> compIdList = null;
        List<String> dirs = null;
        File root = null, each = null;
        long timeCorrection = 0L;
        int x = 0, y = 0;
        Svc.fileStoragePath = fileSavePath;

        logger.info("[App Initializer] Start Initializing.");

        // 시간 교정이 필요한 경우 그 교정값을 설정함
        timeCorrection = systemService.timeCorrection();
        logger.info("[App Initializer] Set Time Correction : " + timeCorrection);

        // 파일 저장공간 확인 및 기초 디렉토리 확인/생성
        compIdList = systemService.getCompanyList();
        dirs = systemService.getDefaultDirectories();
        rootPath = fileSavePath;
        logger.info("[App Initializer] Create Directories / Root : " + rootPath);

        if(rootPath.substring(rootPath.length() - 1).equals(s))   rootPath = rootPath.substring(0, rootPath.length() - 1);
        try{
            if(compIdList != null && compIdList.size() > 0) for(x = 0 ; x < compIdList.size() ; x++){
                compId = compIdList.get(x);
                root = new File(rootPath + s + compId);
                if(root.exists()){
                    logger.info("[App Initializer] Create Directories / Company root : " + compId + " : " + root.getAbsolutePath() + " / exist");
                }else{
                    if(root.mkdir()){
                        logger.info("[App Initializer] Create Directories / Company root : " + compId + " : " + root.getAbsolutePath() + " / created");    
                    }else{
                        logger.info("[App Initializer] Create Directories / Company root : " + compId + " : " + root.getAbsolutePath() + " / create fail");
                    }
                }
                logger.info("[App Initializer] Create Directories / Company root : " + compId + " : " + root.getAbsolutePath());
                if(dirs != null && dirs.size() > 0) for(y = 0 ; y < dirs.size() ; y++){
                    each = new File(rootPath + s + compId + s + dirs.get(y));
                    if(each.exists()){
                        logger.info("[App Initializer] Create Directories / Company root : " + compId + " / " + dirs.get(y) + " : " + each.getAbsolutePath() + " / exist");
                    }else{
                        if(each.mkdir()){
                            logger.info("[App Initializer] Create Directories / Company root : " + compId + " / " + dirs.get(y) + " : " + each.getAbsolutePath() + " / created");
                        }else{
                            logger.info("[App Initializer] Create Directories / Company root : " + compId + " / " + dirs.get(y) + " : " + each.getAbsolutePath() + " / create fail");
                        }
                    }
                }
            }
            logger.info("[App Initializer] Created Companies' directories.");
        }catch(Exception e){
            logger.info("[FATAL] Companies' directory Can't created.");
            e.printStackTrace();
        }

        // 404, 500 코드일 경우 리턴하기 위해서 파일을 읽어서 변수에 저장함
        t = "<!DOCTYPE html><html><head><link rel=\"icon\" href=\"/favicon\" type=\"image/x-icon\"><meta charset=\"UTF-8\"><link rel=\"stylesheet\" type=\"text/css\" href=\"/css/error/error.css\" /><title>404 ERROR!</title></head><body><img src=\"/images/errors/404.jpg\"/></body></html>";
        systemService.set404(t);
        t = "<!DOCTYPE html><html><head><link rel=\"icon\" href=\"/favicon\" type=\"image/x-icon\"><meta charset=\"UTF-8\"><link rel=\"stylesheet\" type=\"text/css\" href=\"/css/error/error.css\" /><title>500 ERROR!</title></head><body><img src=\"/images/errors/500.jpg\"/></body></html>";
        systemService.set500(t);
        
    } // End of appInitialize()

}
