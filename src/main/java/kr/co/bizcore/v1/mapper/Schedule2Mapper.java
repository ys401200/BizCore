package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.Schedule2;

public interface Schedule2Mapper {

    @Select("SELECT `no`,writer,title,content,report,`type`,`from`,`to`,related,permitted,created,modified FROM bizcore.schedule WHERE deleted IS NULL AND compId = #{compId} AND no = #{no}")
    public Schedule2 getSchedule2(@Param("compId") String compId, @Param("no") int no);

    @Select("SELECT `no`,writer,title,content,report,`type`,`from`,`to`,related,permitted,created,modified FROM bizcore.schedule WHERE deleted IS NULL AND compId = #{compId}")
    public List<Schedule2> getListAll(@Param("compId") String compId);

    @Select("SELECT `no`,writer,title,content,report,`type`,`from`,`to`,related,permitted,created,modified FROM bizcore.estimate WHERE deleted IS NULL AND compId = #{compId} AND json_value(related,'$.parent') = #{parent}")
    public List<Schedule2> getListWithParent(@Param("compId") String compId, @Param("parent") String parent);

    @Select("SELECT `no`,writer,title,content,report,`type`,`from`,`to`,related,permitted,created,modified FROM bizcore.estimate WHERE deleted IS NULL AND compId = #{compId} AND json_value(related,'$.parent') IN (#{parents})")
    public List<Schedule2> getListWithParents(@Param("compId") String compId, @Param("parents") String parents);
    
}
