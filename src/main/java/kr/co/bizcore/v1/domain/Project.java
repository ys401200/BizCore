package kr.co.bizcore.v1.domain;

import java.util.Date;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class Project extends Domain{

    protected int no;
    protected String title;
    protected String desc;
    protected int owner;
    protected String related;
    protected Date closed;

}
