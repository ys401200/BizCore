package kr.co.bizcore.v1.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.SimpleUser;

public interface UserMapper {

    @Select("SELECT userno AS userNo, userid AS userId, userName AS userName FROM swcore.swc_user WHERE userno = #{userNo} AND compno = (SELECT compno FROM swcore.swc_company WHERE compid = #{compId}")
    public SimpleUser getBasicUserInfo(String userNo, String compId);

    @Select("SELECT func_id as funcId, sub_id AS subId, CAST(permission AS char(1)) FROM bizcore.permission WHERE comp_id = #{compId} AND user_no = #{userNo} AND dept = #{dept} AND func_id IN (SELECT 'A' UNION ALL SELECT func_id FROM bizsys.comp_permission WHERE comp_id = #{compId} AND permission = 1)")
    public List<Map<String, String>> getUserPermission(@Param("compId") String compId, @Param("dept") String dept,
            @Param("userNo") String userNo);
    
    @Select("SELECT CAST(user_no AS CHAR) AS userNo, dept AS deptId, func_id as funcId, sub_id AS subId, CAST(permission AS char(1)) AS permission FROM bizcore.permission WHERE comp_id = #{compId} AND func_id IN (SELECT 'A' UNION ALL SELECT func_id FROM bizsys.comp_permission WHERE comp_id = #(compId} AND permission = 1)")
    public List<Map<String, String>> getAllUserPermission(String compId);

    @Select("SELECT userno AS userNo, userid AS userId, userName AS userName FROM swcore.swc_user WHERE compno = (SELECT compno FROM swcore.swc_company WHERE compid =#{compId})")
    public List<SimpleUser> getAllUser(String compId);

    @Select("SELECT CAST(user_no AS CHAR) AS userNo, dept_id AS deptId FROM bizcore.user_dept WHERE comp_id = #{compId} ORDER BY user_no, priority")
    public List<Map<String, String>> getAllDeptInfo(String compId);
}
