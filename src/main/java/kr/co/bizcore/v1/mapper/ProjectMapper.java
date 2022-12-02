package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.Project;
import kr.co.bizcore.v1.domain.Sopp2;

public interface ProjectMapper {
    
    @Select("SELECT no, title, `desc`, owner, related, closed, created, modified FROM bizcore.project WHERE deleted IS NULL AND compId = #{compId}")
    public List<Project> getProjectList(@Param("compId") String compId);

    @Select("SELECT no, title, `desc`, owner, related, closed, created, modified FROM bizcore.project WHERE deleted IS NULL AND compId = #{compId} AND no = #{no}")
    public Project getProject(@Param("compId") String compId, @Param("no") int no);

    @Select("SELECT `no`, stage, title, `desc`, owner, coWorker, customer, picOfCustomer, partner, picOfPartner, expactetSales, expactedDate, related, closed, created, modified FROM bizcore.sopp WHERE deleted IS NULL AND compId = #{compId}")
    public List<Sopp2> getSoppList(@Param("compId") String compId);

    @Select("SELECT `no`, stage, title, `desc`, owner, coWorker, customer, picOfCustomer, partner, picOfPartner, expactetSales, expactedDate, related, closed, created, modified FROM bizcore.sopp WHERE deleted IS NULL AND compId = #{compId} AND NO = #{no}")
    public Sopp2 getSopp(@Param("compId") String compId, @Param("no") int no);

    @Select("SELECT owner FROM bizcore.project WHERE deleted IS NULL AND compId = #{compId} AND NO = (SELECT IF(SUBSTRING(JSON_VALUE(related, '$.parent'),1,7) = 'project', SUBSTRING(JSON_VALUE(related, '$.parent'),9,100), NULL) FROM bizcore.sopp WHERE deleted IS NULL AND compId = #{compId} AND NO = #{no})")
    public Integer getProjectOwnerWithSoppNo(@Param("compId") String compId, @Param("no") int no);
}
