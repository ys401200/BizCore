package kr.co.bizcore.v1.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttachedFile extends Domain{

    private int idx;
    private int articalNo;
    private String ognName;
    @JsonIgnore
    private String savedName;
    private long size;
    private int removed;
    
}
