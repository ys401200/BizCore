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

    // ========================= 2023.08.16 이후 ==================================
    private int userNo;
    private int compNo;
    private String compId;
    private String compName;
    private String userId;
    private String userName;
    private String userPasswd;
    private String userTel;
    private String userEmail;
    private int userOtp;
    private String userRole;
    private int userCode;
    private String docRole;
    private String userKey;
    private int org_id;
    private String listDateFrom;
    private String regDatetime;
    private String modDatetime;
    private String attrib;

    private int getCount;
}