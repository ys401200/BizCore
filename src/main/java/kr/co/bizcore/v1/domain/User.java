package kr.co.bizcore.v1.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class User extends Domain {
    
    private int no;
    private String id;
    private String name;
    private String phone;
    private String email;
    
}