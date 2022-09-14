package kr.co.bizcore.v1.mapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @Select("SELECT CAST(user_no AS CHAR) AS userNo, dept_id AS deptId FROM bizcore.user_dept WHERE comp_id = #{compId} ORDER BY user_no, priority")
    public List<Map<String, String>> getAllDeptInfo(String compId);

    @Select("SELECT CAST(user_no AS char) AS userNo, dept AS deptId, func_id AS func, sub_id AS sub, CAST(permission AS char) AS permission FROM bizcore.permission WHERE comp_id = #{compId}")
    public List<Map<String, String>> getAllPermission(String compId);

    // 마이페이지 / 내 정보 가져오기
    @Select("SELECT no, userId AS id, userName AS name, rank, birthDay, gender, email, address, homePhone, cellPhone, created, modified, deleted FROM bizcore.users WHERE no = #{no} AND pw = #{pw} AND compid = #{compId}")
    public User getMy(@Param("no") String userNo, @Param("pw") String pw, @Param("compId") String compId);

    // 마이페이지 / 내 정보 수정
    @Select("UPDATE bizcore.users SET email=#{e.email}, address=#{e.address}, homePhone=#{e.homePhone}, cellPhone=#{e.cellPhone}, modified = now() WHERE compId = #{compId} AND no=#{e.no}")
    public void modifyMyInfo(@Param("e") User user, @Param("compId") String compId);

    // 마이페이지 / 비번 수정
    @Update("UPDATE bizcore.users SET pw = #{new} WHERE no = #{no} AND pw = #{old} AND compid = #{compId}")
    public void modifyMyPw(@Param("compId") String compId, @Param("no") String userNo, @Param("old") String old, @Param("new") String neww);

    // 관리자용 / 사용자 수정
    @Select("UPDATE bizcore.users SET email=#{e.email}, address=#{e.address}, homePhone=#{e.homePhone}, cellPhone=#{e.cellPhone}, modified = now() WHERE compId = #{compId} AND no=#{e.no}")
    public void modifyUserInfo(@Param("e") User user, @Param("compId") String compId);

    // 관리자용 / 비번 수정
    @Update("UPDATE bizcore.users SET pw = #{new} WHERE no = #{no} AND pw = #{old} AND compid = #{compId}")
    public void modifyUserPw(@Param("compId") String compId, @Param("no") String userNo, @Param("old") String old, @Param("new") String neww);

    // 직급 정보 가져오기
    @Select("SELECT CAST(`level` AS CHAR) AS lv, nameKor, nameEng FROM bizcore.user_rank WHERE compId = #{compId} ORDER BY `level`")
    public List<HashMap<String, String>> getUserRank(@Param("compId") String compId);

}