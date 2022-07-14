package kr.co.bizcore.v1.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class User extends SimpleUser {
    
    private String phone;
    private String email;
    

}


/*
    private int userNo;
    private String compId;
    private String userId;
    private String userName;
    private String deptId;
 */