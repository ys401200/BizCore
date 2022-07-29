package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.Dept;

public interface DeptMapper {

    @Select("SELECT org_id AS id, org_title AS deptName, org_code AS deptId, org_mcode AS parent, org_color AS colorCode from swc_organiz where compno = (SELECT compno FROM swc_company WHERE compid = #{compId})")
    public List<Dept> getAllDept(String compId);

}
