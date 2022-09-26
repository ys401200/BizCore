package kr.co.bizcore.v1.mapper;

import java.util.HashMap;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

public interface NotesMapper {
    
    @Select("SELECT COUNT(*) FROM bizcore.notes WHERE deleted IS NULL AND compId = #{compId} AND reader = #{userNo}")
    public int getUnreadNoteCount(@Param("compId") String compId, @Param("userNo") String userNo);

    @Select("SELECT a.writer, a.`count` FROM (SELECT writer, COUNT(*) AS `count` FROM bizcore.notes WHERE deleted IS NULL AND compId = #{compId} AND reader = #{userNo} GROUP BY writer) a WHERE `count` > 0 ORDER BY `count` desc")
    public HashMap<String, Integer> getUnreadNptesDevideWriter(@Param("compId") String compId, @Param("userNo") String userNo);


}
