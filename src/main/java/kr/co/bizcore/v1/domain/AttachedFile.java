package kr.co.bizcore.v1.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttachedFile extends Domain{

    @JsonIgnore
    private int idx;
    @JsonIgnore
    private int articleNo;
    private String ognName;
    @JsonIgnore
    private String savedName;
    private long size;
    private int removed;
    
}
