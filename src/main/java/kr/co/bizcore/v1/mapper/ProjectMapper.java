package kr.co.bizcore.v1.mapper;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Insert;
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

    @Insert("INSERT INTO bizcore.sopp_chat(compId, sopp, isNotice, writer, stage, message, created) VALUES(#{compId}, #{sopp}, #{isNotice}, #{writer}, #{stage}, #{message}, now())")
    public int addSoppChat(@Param("compId") String compId, @Param("sopp") int sopp, @Param("isNotice") boolean isNotice, @Param("writer") int writer, @Param("stage") int stage, @Param("message") String message);

    @Select("SELECT CAST(isNotice AS CHAR) isNotice, CAST(writer AS CHAR) writer, CAST(stage AS CHAR) stage, message, CAST(UNIX_TIMESTAMP(created)*1000 AS CHAR) created FROM bizcore.sopp_chat WHERE deleted IS NULL AND compId = #{compId} AND sopp = #{sopp} ORDER BY created")
    public List<HashMap<String, String>> getSoppChat(@Param("compId")String compId, @Param("sopp") int soppNo);
}
