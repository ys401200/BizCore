package kr.co.bizcore.v1.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.User;

public interface UserMapper {
    @Select("select a.userno as userNo, (select compid from swcore.swc_company c where c.compno = a.compno) as compId, a.userid as userId, a.userName as userName, b.org_code as deptId from swcore.swc_user a, swcore.swc_organiz b where a.org_id = b.org_id and userno = #{userNo}")
    public User getBasicUserInfo(String userNo);

    @Select("SELECT func_id as funcId, sub_id AS subId, CAST(permission AS char(1)) FROM bizcore.permission WHERE comp_id = #{compId} AND user_no = #{userNo} AND dept = #{dept} AND func_id IN (SELECT 'A' UNION ALL SELECT func_id FROM bizsys.comp_permission WHERE comp_id = #{compId} AND permission = 1)")
    public List<Map<String, String>> getUserPermission(@Param("compId") String compId, @Param("dept") String dept,
            @Param("userNo") String userNo);
}
