package kr.co.bizcore.v1;

import java.io.File;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import kr.co.bizcore.v1.interceptor.ViewInterceptor;
import kr.co.bizcore.v1.svc.Svc;
import kr.co.bizcore.v1.svc.SystemService;
import kr.co.bizcore.v1.util.UploadedFileStorage;

@Configuration
public class ViewConfig implements WebMvcConfigurer {

    @Autowired
    private SystemService systemService;

    @Value("${bizcore.storage.uploadedfile}")
    private String fileUploadedPath;

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
    public UploadedFileStorage getFileStorage(){
        return new UploadedFileStorage(fileUploadedPath);
    }

    private void appInitialize(){

        String rootPath = null, compId = null;
        List<String> compIdList = null;
        File root = null, attached = null, temp = null, directAccess = null;
        int x = 0;

        // DEBUG 모드 세팅
        Svc.DEBUG = debug.equals("true");

        // 시간 교정이 필요한 경우 그 교정값을 설정함
        systemService.timeCorrection();

        // 파일 저장공간 확인 및 기초 디렉토리 확인/생성
        compIdList = systemService.getCompanyList();
        rootPath = fileUploadedPath;
        if(rootPath.substring(rootPath.length() - 1).equals("/"))   rootPath = rootPath.substring(0, rootPath.length() - 1);
        try{
            if(compIdList != null && compIdList.size() > 0) for(x = 0 ; x < compIdList.size() ; x++){
                compId = compIdList.get(x);
                root = new File(rootPath + "/" + compId);
                attached = new File(rootPath + "/" + compId + "/" + "attached");
                temp = new File(rootPath + "/" + compId + "/" + "temp");
                directAccess = new File(rootPath + "/" + compId + "/" + "directAccess");
                if(!root.exists())          root.mkdir();
                if(!attached.exists())      attached.mkdir();
                if(!temp.exists())          temp.mkdir();
                if(!directAccess.exists())  directAccess.mkdir();
            }
            System.out.println("[App Initializer] Created Companies' directories.");
        }catch(Exception e){
            System.out.println("[FATAL] Companies' directory Can't created. Terminated.");
            e.printStackTrace();
            System.exit(-1);
        }

    } // End of appInitialize()

}
