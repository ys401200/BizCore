package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.Project;
import kr.co.bizcore.v1.domain.Sopp2;

public interface ProjectMapper {
    
    @Select("SELECT no, title, `desc`, owner, related, closed, created, modified FROM bizcore.project WHERE deleted IS NULL AND compId = #{compId}")
    public List<Project> getProjectList(@Param("compId") String compId);

    @Select("SELECT `no`, stage, title, `desc`, owner, coWorker, customer, picOfCustomer, partner, picOfPartner, expactetSales, expactedDate, related, closed, created, modified FROM bizcore.sopp WHERE deleted IS NULL AND compId = #{compId}")
    public List<Sopp2> getSoppList(@Param("compId") String compId);
}
