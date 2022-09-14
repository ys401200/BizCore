package kr.co.bizcore.v1.domain;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class User extends Domain {
    private int no;
    private String id;
    private String name;
    private int rank;
    private Date birthDay;
    private int gender;
    private String email;
    private String address;
    private String homePhone;
    private String cellPhone;
}