package kr.co.bizcore.v1.mapper;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.Dept;

public interface DeptMapper {

    @Select("SELECT idx id, deptName, deptId, parent, colorCode FROM bizcore.department WHERE compId = #{compId}")
    public List<Dept> getAllDept(String compId);

    // 관리자 페이지 용 / 부서 정보를 가져오는 메서드
    @Select("SELECT deptId, deptName, parent, taxId, CAST(zipcode AS CHAR) zipCode, address, contact, fax, email, remark, colorCode, if(compId=deptId,'1','0') isRoot, CAST(unix_timestamp(created)*1000 AS CHAR) created, CAST(unix_timestamp(modified)*1000 AS CHAR) modified, CAST(unix_timestamp(deleted)*1000 AS CHAR) deleted, CAST((SELECT user_no FROM bizcore.permission WHERE func_id = 'head' AND comp_id = compId AND dept = deptId) AS CHAR) head, CAST((SELECT user_no FROM bizcore.permission WHERE func_id = 'doc' AND comp_id = compId AND dept = deptId) AS CHAR) doc FROM bizcore.department WHERE deleted IS NULL AND compId = #{compId} AND deptId = #{dept}")
    public HashMap<String, String> getDeptDetailInfo(@Param("compId") String compId, @Param("dept") String dept);

}
