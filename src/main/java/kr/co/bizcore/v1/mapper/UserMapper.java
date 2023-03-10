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

    // ??????????????? / ??? ?????? ????????????
    @Select("SELECT no, userId AS id, userName AS name, rank, birthDay, gender, email, address, homePhone, cellPhone, created, modified, deleted FROM bizcore.users WHERE no = #{no} AND pw = #{pw} AND compid = #{compId}")
    public User getMy(@Param("no") String userNo, @Param("pw") String pw, @Param("compId") String compId);

    // ??????????????? / ??? ?????? ??????
    @Select("UPDATE bizcore.users SET email=#{email}, address=#{address}, homePhone=#{homePhone}, cellPhone=#{cellPhone}, zipCode=#{zipCode}, modified = now() WHERE compId = #{compId} AND no=#{no}")
    public void modifyMyInfo(@Param("compId") String compId, @Param("no") String userNo, @Param("email") String email, @Param("address") String address, @Param("homePhone") String homePhone, @Param("cellPhone") String cellPhone, @Param("zipCode") Integer zipCode);

    // ??????????????? / ?????? ??????
    @Update("UPDATE bizcore.users SET pw = #{new} WHERE no = #{no} AND pw = #{old} AND compid = #{compId}")
    public int modifyMyPw(@Param("compId") String compId, @Param("no") String userNo, @Param("old") String old, @Param("new") String neww);

    // ???????????? / ????????? ??????
    @Select("UPDATE bizcore.users SET email=#{e.email}, address=#{e.address}, homePhone=#{e.homePhone}, cellPhone=#{e.cellPhone}, modified = now() WHERE compId = #{compId} AND no=#{e.no}")
    public void modifyUserInfo(@Param("e") User user, @Param("compId") String compId);

    // ???????????? / ?????? ??????
    @Update("UPDATE bizcore.users SET pw = #{new} WHERE no = #{no} AND pw = #{old} AND compid = #{compId}")
    public void modifyUserPw(@Param("compId") String compId, @Param("no") String userNo, @Param("old") String old, @Param("new") String neww);

    // ?????? ?????? ????????????
    @Select("SELECT CAST(`level` AS CHAR) AS lv, nameKor, nameEng FROM bizcore.user_rank WHERE compId = #{compId} ORDER BY `level`")
    public List<HashMap<String, String>> getUserRank(@Param("compId") String compId);

    // ????????? ?????? ????????????
    @Select("SELECT `data` FROM bizcore.personalize WHERE compId = #{compId} AND userNo = #{no}")
    public String getPersonalize(@Param("compId") String compId, @Param("no") String userNo);

    // ????????? ?????? ????????????
    @Update("UPDATE bizcore.personalize SET `data` = #{json} WHERE compId = #{compId} AND userNo = #{no}")
    public int modifyPersonalize(@Param("compId") String compId, @Param("no") String userNo, @Param("json") String data);

    // ????????? ?????? ????????????
    @Insert("INSERT INTO bizcore.personalize(compId, userNo, `data`) VALUES(#{compId}, #{no}, #{json})")
    public int addPersonalize(@Param("compId") String compId, @Param("no") String userNo, @Param("json") String data);

    // ????????? ???????????? - ?????? ??? ?????? ?????? ?????? ????????????
    @Select("SELECT CAST(no AS CHAR) AS no, userId, userName, CAST(`rank` AS CHAR) AS `rank`, CAST(prohibited AS CHAR) AS prohibited, CAST(birthDay AS CHAR) AS birthDay, gender, residentNo, email, address, CAST(zipCode AS CHAR) as zipCode, homePhone, cellPhone, cast(joined AS CHAR) as joined, CAST(resigned AS CHAR) AS resigned, CAST(UNIX_TIMESTAMP(created)*1000 AS CHAR) created, CAST(UNIX_TIMESTAMP(modified)*1000 AS CHAR) modified, CAST(UNIX_TIMESTAMP(deleted)*1000  AS CHAR) deleted FROM bizcore.users WHERE (deleted IS NULL OR deleted > DATE_ADD(NOW(), INTERVAL -1 MONTH)) AND compId = #{compId} AND no = #{employee}")
    public HashMap<String, String> getEmployeeDetailInfo(@Param("compId") String compId, @Param("employee") int employee);
    

}