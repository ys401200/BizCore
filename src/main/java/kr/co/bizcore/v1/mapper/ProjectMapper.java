package kr.co.bizcore.v1.mapper;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.Project;
import kr.co.bizcore.v1.domain.Schedule2;
import kr.co.bizcore.v1.domain.Sopp2;

public interface ProjectMapper {

     // ======================= P R O J E C T =======================================
    
    @Select("SELECT no, title, `desc`, owner, related, closed, created, modified FROM bizcore.project WHERE deleted IS NULL AND compId = #{compId}")
    public List<Project> getProjectList(@Param("compId") String compId);

    @Select("SELECT no, title, `desc`, owner, related, closed, created, modified FROM bizcore.project WHERE deleted IS NULL AND compId = #{compId} AND no = #{no}")
    public Project getProject(@Param("compId") String compId, @Param("no") int no);

    // ======================= S O P P  =======================================

    @Select("SELECT `no`, stage, title, `desc`, owner, coWorker, customer, picOfCustomer, partner, picOfPartner, expectedSales, expectedDate, related, closed, created, modified, v estm FROM bizcore.sopp a LEFT JOIN (SELECT count(`version`) v, json_value(related, '$.parent') p FROM bizcore.estimate WHERE json_value(related, '$.parent') NOT LIKE '%null' GROUP BY p) z ON concat('sopp:',a.no) = z.p WHERE a.deleted IS NULL AND a.compId = #{compId}")
    public List<Sopp2> getSoppList(@Param("compId") String compId);

    @Select("SELECT `no`, stage, title, `desc`, owner, coWorker, customer, picOfCustomer, partner, picOfPartner, expectedSales, expectedDate, related, closed, created, modified, v estm FROM bizcore.sopp a LEFT JOIN (SELECT count(`version`) v, json_value(related, '$.parent') p FROM bizcore.estimate WHERE json_value(related, '$.parent') NOT LIKE '%null' GROUP BY p) z ON concat('sopp:',a.no) = z.p WHERE a.deleted IS NULL AND a.compId = #{compId} AND no = #{no}")
    public Sopp2 getSopp(@Param("compId") String compId, @Param("no") int no);

    // ======================= S O P P _ C H A T  =======================================

    @Insert("INSERT INTO bizcore.sopp_chat(compId, sopp, isNotice, writer, stage, message, created) VALUES(#{compId}, #{sopp}, #{isNotice}, #{writer}, #{stage}, #{message}, now())")
    public int addSoppChat(@Param("compId") String compId, @Param("sopp") int sopp, @Param("isNotice") boolean isNotice, @Param("writer") int writer, @Param("stage") int stage, @Param("message") String message);

    @Select("SELECT MAX(idx) FROM bizcore.sopp_chat WHERE deleted IS NULL AND compId = #{compId} AND sopp = #{sopp} AND writer = #{writer}")
    public int getSoppChatIdx(@Param("compId") String compId, @Param("sopp") int sopp, @Param("writer") int writer);

    @Select("SELECT CAST(idx AS CHAR) idx, CAST(isNotice AS CHAR) isNotice, CAST(writer AS CHAR) writer, CAST(stage AS CHAR) stage, message, CAST(UNIX_TIMESTAMP(created)*1000 AS CHAR) created FROM bizcore.sopp_chat WHERE deleted IS NULL AND compId = #{compId} AND sopp = #{sopp} ORDER BY created")
    public List<HashMap<String, String>> getSoppChat(@Param("compId")String compId, @Param("sopp") int soppNo);

    @Update("UPDATE bizcore.sopp_chat SET deleted = NOW() WHERE deleted IS NULL AND compId = #{compId} AND writer = #{userNo} AND idx = #{idx}")
    public int removeSoppChat(@Param("compId") String compId, @Param("userNo") String userNo, @Param("idx") int idx);

    // ======================= S C H E D U L E  =======================================

    @Select("SELECT `no`, writer, title, content, report, `type`, `from`, `to`, related, created, modified FROM bizcore.schedule WHERE deleted IS NULL AND compId = #{compId} AND no = #{no}")
    public Schedule2 getSchedule(@Param("compId") String compId, @Param("no") int no);

    // ======================= E T C  =======================================

    @Select("SELECT owner FROM bizcore.project WHERE deleted IS NULL AND compId = #{compId} AND NO = (SELECT IF(SUBSTRING(JSON_VALUE(related, '$.parent'),1,7) = 'project', SUBSTRING(JSON_VALUE(related, '$.parent'),9,100), NULL) FROM bizcore.sopp WHERE deleted IS NULL AND compId = #{compId} AND NO = #{no})")
    public Integer getProjectOwnerWithSoppNo(@Param("compId") String compId, @Param("no") int no);
}
