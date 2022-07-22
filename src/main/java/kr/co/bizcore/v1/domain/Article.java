package kr.co.bizcore.v1.domain;

import java.util.ArrayList;
import java.util.Date;

import org.json.JSONObject;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Article extends SimpleArticle{

    private String content;
    private Date modified;
    private String related;
    private ArrayList<AttachedFile> attached;

    public int addAttachedFile(AttachedFile file){
        int result = -1;
        if(file == null)    return result;
        if(attached == null)    attached = new ArrayList<>();
        attached.add(file);
        return result;
    }

    public Article(){}

    @Override
    public String toJson() {
        ObjectMapper mapper = new ObjectMapper();
        String result = null;
        try {
            result = mapper.writeValueAsString(this);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return result;
    }
    
}
