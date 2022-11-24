package kr.co.bizcore.v1.svc;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Project;
import kr.co.bizcore.v1.domain.Sopp2;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ProjectService extends Svc{

    private static final Logger logger = LoggerFactory.getLogger(ProjectService.class);

    public String getProjects(String compId){
        String result = null;
        List<Project> list = null;
        Project prj = null;
        int x = 0;

        list = projectMapper.getProjectList(compId);

        result = "[";
        if(list != null && list.size() > 0) for(x = 0 ; x < list.size() ; x++){
            if(x > 0)   result += ",";
            prj = list.get(x);
            result += prj.toJson();
        }
        result += "]";

        return result;
    } // End of getProjects()

    public String getSoppList(String compId){
        String result = null;
        List<Sopp2> list = null;
        Sopp2 sopp = null;
        int x = 0;

        list = projectMapper.getSoppList(compId);

        result = "[";
        if(list != null && list.size() > 0) for(x = 0 ; x < list.size() ; x++){
            if(x > 0)   result += ",";
            sopp = list.get(x);
            result += sopp.toJson();
        }
        result += "]";

        return result;
    } // End of getProjects()
    
}
