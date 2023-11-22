package kr.co.bizcore.v1.mapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.SimpleUser;
import kr.co.bizcore.v1.domain.User;

public interface UserMapper {
    @Select("SELECT compNo from swc_company WHERE compId = #{compId}")
    public Integer getCompNo(@Param("compId") String compId);

    @Insert("INSERT INTO swc_user (compNo, userId, userPasswd, userName, userRole, userRank, userDept, regDatetime) VALUES (#{user.compNo}, #{user.userId}, PASSWORD(#{user.userPasswd}), #{user.userName}, #{user.userRole}, #{user.userRank}, #{user.userDept}, now())")
    public int userInsert(@Param("user") User user);

    @Update("UPDATE swc_user SET attrib = 'XXXXX' WHERE userNo = #{userNo} AND compNo = #{compNo}")
    public int userDelete(@Param("compNo") int compNo, @Param("userNo") String userNo);

    @Update("UPDATE swc_user SET userName = #{user.userName}, userTel = #{user.userTel}, userEmail = #{user.userEmail}, userRole = #{user.userRole}, userKey = #{user.userKey}, userRank = #{user.userRank}, userDept = #{user.userDept}, userOtp = #{user.userOtp}, modDatetime = now(), attrib = #{user.attrib} WHERE userNo = #{user.userNo} AND compNo = #{user.compNo}")
    public int updateUser(@Param("user") User user);

    @Update("UPDATE swc_user SET userPasswd = PASSWORD(1234), modDatetime = now() WHERE userNo = #{user.userNo} AND compNo = #{user.compNo}")
    public int passwordReset(@Param("user") User user);

    @Select("SELECT *, count(*) as getCount from swc_user WHERE compNo = #{user.compNo} AND userId = #{user.userId} AND userPasswd = PASSWORD(#{user.userPasswd}) AND attrib not like 'XXX%'")
    public User loginCheck(@Param("user") User user);

    @Select("SELECT count(*) from swc_user WHERE userId = #{user.userId} AND userPasswd = PASSWORD(#{user.userPasswd}) AND compNo = #{user.compNo}")
    public Integer passwordCheck(@Param("user") User user);

    @Update("UPDATE swc_user SET userPasswd = PASSWORD(#{user.userPasswd}), modDatetime = now() WHERE userId = #{user.userId} AND compNo = #{user.compNo}")
    public int settingUserUpdate(@Param("user") User user);

    @Select("SELECT * FROM swc_user")
    public List<User> getUserList();

    @Select("SELECT no AS userNo, compId, userId, userName, rank, gender, deleted FROM bizcore.users WHERE no = #{userNo} AND compid = #{compId}")
    public SimpleUser getBasicUserInfo(@Param("userNo") String userNo, @Param("compId") String compId);

    @Select("SELECT func_id as funcId, sub_id AS subId, CAST(permission AS char(1)) AS permission FROM bizcore.permission WHERE comp_id = #{compId} AND user_no = #{userNo} AND dept = #{dept} AND func_id IN (SELECT 'A' UNION ALL SELECT func_id FROM bizsys.comp_permission WHERE comp_id = #{compId} AND permission = 1)")
    public List<Map<String, String>> getUserPermission(@Param("compId") String compId, @Param("dept") String dept,
            @Param("userNo") String userNo);
    
    @Select("SELECT CAST(user_no AS CHAR) AS userNo, dept AS deptId, func_id as funcId, sub_id AS subId, CAST(permission AS char(1)) AS permission FROM bizcore.permission WHERE comp_id = #{compId} AND func_id IN (SELECT 'A' UNION ALL SELECT func_id FROM bizsys.comp_permission WHERE comp_id = #(compId} AND permission = 1)")
    public List<Map<String, String>> getAllUserPermission(String compId);

    @Select("SELECT no AS userNo, compId, userId, userName, rank, gender, deleted FROM bizcore.users WHERE compid = #{compId}")
    public List<SimpleUser> getAllUser(String compId);

    @Select("SELECT no AS userNo, compId, userId, userName, rank, gender, IF(deleted > DATE_ADD(NOW(), INTERVAL -1 month), NULL, deleted) AS deleted FROM bizcore.users WHERE compid = #{compId}")
    public List<SimpleUser> getAllUserForAdmin(String compId);

    @Select("SELECT CAST(user_no AS CHAR) AS userNo, dept_id AS deptId FROM bizcore.user_dept WHERE comp_id = #{compId} ORDER BY user_no, priority")
    public List<Map<String, String>> getAllDeptInfo(String compId);

    @Select("SELECT CAST(user_no AS char) AS userNo, dept AS deptId, func_id AS func, sub_id AS sub, CAST(permission AS char) AS permission FROM bizcore.permission WHERE comp_id = #{compId}")
    public List<Map<String, String>> getAllPermission(String compId);

    // 마이페이지 / 내 정보 가져오기
    @Select("SELECT no, userId AS id, userName AS name, rank, birthDay, gender, email, address, homePhone, cellPhone, created, modified, deleted FROM bizcore.users WHERE no = #{no} AND pw = #{pw} AND compid = #{compId}")
    public User getMy(@Param("no") String userNo, @Param("pw") String pw, @Param("compId") String compId);

    // 마이페이지 / 내 정보 수정
    @Select("UPDATE bizcore.users SET email=#{email}, address=#{address}, homePhone=#{homePhone}, cellPhone=#{cellPhone}, zipCode=#{zipCode}, modified = now() WHERE compId = #{compId} AND no=#{no}")
    public void modifyMyInfo(@Param("compId") String compId, @Param("no") String userNo, @Param("email") String email, @Param("address") String address, @Param("homePhone") String homePhone, @Param("cellPhone") String cellPhone, @Param("zipCode") Integer zipCode);

    // 마이페이지 / 비번 수정
    @Update("UPDATE bizcore.users SET pw = #{new} WHERE no = #{no} AND pw = #{old} AND compid = #{compId}")
    public int modifyMyPw(@Param("compId") String compId, @Param("no") String userNo, @Param("old") String old, @Param("new") String neww);

    // 관리자용 / 사용자 수정
    @Select("UPDATE bizcore.users SET email=#{e.email}, address=#{e.address}, homePhone=#{e.homePhone}, cellPhone=#{e.cellPhone}, modified = now() WHERE compId = #{compId} AND no=#{e.no}")
    public void modifyUserInfo(@Param("e") User user, @Param("compId") String compId);

    // 관리자용 / 비번 수정
    @Update("UPDATE bizcore.users SET pw = #{new} WHERE no = #{no} AND pw = #{old} AND compid = #{compId}")
    public void modifyUserPw(@Param("compId") String compId, @Param("no") String userNo, @Param("old") String old, @Param("new") String neww);

    // 직급 정보 가져오기
    @Select("SELECT CAST(`level` AS CHAR) AS lv, nameKor, nameEng FROM bizcore.user_rank WHERE compId = #{compId} ORDER BY `level`")
    public List<HashMap<String, String>> getUserRank(@Param("compId") String compId);

    // 개인화 정보 가져오기
    @Select("SELECT `data` FROM bizcore.personalize WHERE compId = #{compId} AND userNo = #{no}")
    public String getPersonalize(@Param("compId") String compId, @Param("no") String userNo);

    // 개인화 정보 수정하기
    @Update("UPDATE bizcore.personalize SET `data` = #{json} WHERE compId = #{compId} AND userNo = #{no}")
    public int modifyPersonalize(@Param("compId") String compId, @Param("no") String userNo, @Param("json") String data);

    // 개인화 정보 추가하기
    @Insert("INSERT INTO bizcore.personalize(compId, userNo, `data`) VALUES(#{compId}, #{no}, #{json})")
    public int addPersonalize(@Param("compId") String compId, @Param("no") String userNo, @Param("json") String data);

    // 관리자 페이지용 - 직원 한 명의 전체 정보 가져오기
    @Select("SELECT CAST(no AS CHAR) AS no, userId, userName, CAST(`rank` AS CHAR) AS `rank`, CAST(prohibited AS CHAR) AS prohibited, CAST(birthDay AS CHAR) AS birthDay, gender, residentNo, email, address, CAST(zipCode AS CHAR) as zipCode, homePhone, cellPhone, cast(joined AS CHAR) as joined, CAST(resigned AS CHAR) AS resigned, CAST(UNIX_TIMESTAMP(created)*1000 AS CHAR) created, CAST(UNIX_TIMESTAMP(modified)*1000 AS CHAR) modified, CAST(UNIX_TIMESTAMP(deleted)*1000  AS CHAR) deleted FROM bizcore.users WHERE (deleted IS NULL OR deleted > DATE_ADD(NOW(), INTERVAL -1 MONTH)) AND compId = #{compId} AND no = #{employee}")
    public HashMap<String, String> getEmployeeDetailInfo(@Param("compId") String compId, @Param("employee") int employee);
    

}