package kr.co.bizcore.v1.mapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.SimpleUser;
import kr.co.bizcore.v1.domain.User;

public interface UserMapper {

    @Select("SELECT userNo, userId, userName, gender, IF(deleted IS NULL, FALSE, TRUE) AS resign FROM bizcore.users WHERE userno = #{userNo} AND compid = #{compId}")
    public SimpleUser getBasicUserInfo(@Param("userNo") String userNo, @Param("compId") String compId);

    @Select("SELECT func_id as funcId, sub_id AS subId, CAST(permission AS char(1)) AS permission FROM bizcore.permission WHERE comp_id = #{compId} AND user_no = #{userNo} AND dept = #{dept} AND func_id IN (SELECT 'A' UNION ALL SELECT func_id FROM bizsys.comp_permission WHERE comp_id = #{compId} AND permission = 1)")
    public List<Map<String, String>> getUserPermission(@Param("compId") String compId, @Param("dept") String dept,
            @Param("userNo") String userNo);
    
    @Select("SELECT CAST(user_no AS CHAR) AS userNo, dept AS deptId, func_id as funcId, sub_id AS subId, CAST(permission AS char(1)) AS permission FROM bizcore.permission WHERE comp_id = #{compId} AND func_id IN (SELECT 'A' UNION ALL SELECT func_id FROM bizsys.comp_permission WHERE comp_id = #(compId} AND permission = 1)")
    public List<Map<String, String>> getAllUserPermission(String compId);

    @Select("SELECT no AS userNo, userId, userName, `rank`, IF(deleted IS NULL, FALSE, TRUE) AS resign FROM bizcore.users where deleted IS NULL AND compid = #{compId}")
    public List<SimpleUser> getAllUser(String compId);

    @Select("SELECT CAST(user_no AS CHAR) AS userNo, dept_id AS deptId FROM bizcore.user_dept WHERE comp_id = #{compId} ORDER BY user_no, priority")
    public List<Map<String, String>> getAllDeptInfo(String compId);

    @Select("SELECT CAST(user_no AS char) AS userNo, dept AS deptId, func_id AS func, sub_id AS sub, CAST(permission AS char) AS permission FROM bizcore.permission WHERE comp_id = #{compId}")
    public List<Map<String, String>> getAllPermission(String compId);

    // 마이페이지 / 내 정보 가져오기
    @Select("SELECT userno AS no, userid AS id, username AS name, usertel as phone, useremail AS email FROM swc_user WHERE userno = #{no} AND userpasswd = PASSWORD(#{pw}) AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId})")
    public User getMy(@Param("no") String userNo, @Param("pw") String pw, @Param("compId") String compId);

    // 마이페이지 / 내 정보 수정
    @Select("UPDATE swcore.swc_user SET usertel = #{phone}, useremail = #{email} WHERE userno = #{no} AND compNo = (SELECT compno FROM swcore.swc_company WHERE compid = #{compId})")
    public void modifyMyInfo(@Param("phone") String phone, @Param("email") String email, @Param("no") String userNo, @Param("compId") String compId);

    // 마이페이지 / 비번 수정
    @Select("UPDATE swcore.swc_user SET userpasswd = PASSWORD(#{new}) WHERE userno = #{no} AND userpasswd = PASSWORD(#{old}) AND compNo = (SELECT compno FROM swcore.swc_company WHERE compid = #{compId})")
    public void modifyMyPw(@Param("compId") String compId, @Param("no") String userNo, @Param("old") String old, @Param("new") String neww);

    // 직급 정보 가져오기
    @Select("SELECT CAST(`level` AS CHAR) AS lv, nameKor, nameEng FROM bizcore.user_rank WHERE compId = #{compId} ORDER BY `level`")
    public List<HashMap<String, String>> getUserRank(@Param("compId") String compId);

}