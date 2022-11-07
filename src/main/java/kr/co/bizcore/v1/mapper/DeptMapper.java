package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.Dept;

public interface DeptMapper {

    @Select("SELECT idx id, deptName, deptId, parent, colorCode FROM bizcore.department WHERE compId = #{compId}")
    public List<Dept> getAllDept(String compId);

}
