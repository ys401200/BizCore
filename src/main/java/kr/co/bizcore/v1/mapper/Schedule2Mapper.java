package kr.co.bizcore.v1.mapper;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.Schedule2;

public interface Schedule2Mapper {

    @Select("SELECT `no`,writer,title,content,report,`type`,`from`,`to`,related,permitted,created,modified FROM bizcore.schedule WHERE deleted IS NULL AND compId = #{compId} AND no = #{no}")
    public Schedule2 getSchedule2(@Param("compId") String compId, @Param("no") int no);

    @Select("SELECT `no`,writer,title,content,report,`type`,`from`,`to`,related,permitted,created,modified FROM bizcore.schedule WHERE deleted IS NULL AND compId = #{compId}")
    public List<Schedule2> getListAll(@Param("compId") String compId);

    @Select("SELECT `no`,writer,title,content,report,`type`,`from`,`to`,related,permitted,created,modified FROM bizcore.schedule WHERE deleted IS NULL AND compId = #{compId} AND json_value(related,'$.parent') = #{parent}")
    public List<Schedule2> getListWithParent(@Param("compId") String compId, @Param("parent") String parent);

    @Select("SELECT `no`,writer,title,content,report,`type`,`from`,`to`,related,permitted,created,modified FROM bizcore.schedule WHERE deleted IS NULL AND compId = #{compId} AND (json_value(related,'$.parent') = #{parent} OR json_value(related,'$.parent') IN (SELECT concat('contract:',no) FROM bizcore.contract WHERE deleted IS NULL AND compId = #{compId} AND json_value(related,'$.parent') = #{parent}) OR json_value(related,'$.parent') IN (SELECT concat('maintenance:',no) FROM bizcore.maintenance WHERE deleted IS NULL AND compId = #{compId} AND contract IN (SELECT no FROM bizcore.contract WHERE deleted IS NULL AND compId = #{compId} AND json_value(related,'$.parent') = #{parent})))")
    public List<Schedule2> getListWithSopp(@Param("compId") String compId, @Param("parent") String sopp);

    @Select("SELECT `no`,writer,title,content,report,`type`,`from`,`to`,related,permitted,created,modified FROM bizcore.schedule WHERE deleted IS NULL AND compId = #{compId} AND json_value(related,'$.parent') IN (#{parents})")
    public List<Schedule2> getListWithParents(@Param("compId") String compId, @Param("parents") String parents);

    // ???????????? ????????? ????????? ????????? ?????? ????????? ????????? ???????????? ?????????
    @Select("SELECT count(*) FROM bizcore.sopp WHERE deleted IS NULL AND compId = #{compId} AND no = #{sopp} AND ((owner = #{userNo} OR coworker LIKE CONCAT('%', #{userNo}, '%')) OR json_value(related,'$.parent') = (SELECT CONCAT('project:',no) FROM bizcore.project WHERE deleted IS NULL AND compId = #{compId} AND owner = #{userNo}))")
    public int checkPermissionWithSopp(@Param("compId") String compId, @Param("userNo") String userNo, @Param("sopp") int sopp);

    // ????????? ????????? ????????? ???????????? ?????????
    @Select("SELECT no, writer, title, content, report, type, `from`, `to`, related, permitted, created, modified FROM bizcore.schedule WHERE deleted IS NULL AND compId = #{compId} AND no = #{no}")
    public Schedule2 getScheduleWithNo(@Param("compId") String compId, @Param("no") int no);

    // ????????? ????????? ???????????? ?????????
    @Select("SELECT CAST(`date` AS CHAR) dt, name FROM bizcore.holiday WHERE contury = #{contury} AND YEAR(`date`) >= YEAR(DATE_ADD(now(), INTERVAL -2 YEAR)) ORDER BY `date`")
    public List<HashMap<String, String>> getHolidayInfo(@Param("contury") String contury);


    
    
}
