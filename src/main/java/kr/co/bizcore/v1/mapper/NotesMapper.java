package kr.co.bizcore.v1.mapper;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

public interface NotesMapper {
    
    // 읽지 않은 메시지를 카운트하는 메서드
    @Select("SELECT 'all' AS writer, CAST(COUNT(*) AS CHAR) AS ct FROM bizcore.notes WHERE deleted IS NULL AND compId = #{compId} AND reader = #{userNo} " +
            "UNION ALL " +
            "SELECT CAST(writer AS CHAR) AS writer, a.ct FROM (SELECT writer, CAST(COUNT(*) AS CHAR) AS ct FROM bizcore.notes WHERE deleted IS NULL AND compId = #{compId} AND reader = #{userNo} GROUP BY writer) a WHERE a.ct > 0")
    public List<HashMap<String, String>> getNewCount(@Param("compId") String compId, @Param("userNo") String userNo);

    // 특정 발신자와의 대화를 가져오는
    @Select("SELECT CAST(writer AS CHAR) AS writer, CAST(UNIX_TIMESTAMP(sent)*1000 AS CHAR) AS sent, CAST(UNIX_TIMESTAMP(`read`)*1000 AS CHAR) AS `read`, message, related FROM bizcore.notes WHERE deleted IS NULL AND sent < #{time} AND compId = #{compId} AND ((writer = #{writer} AND reader = #{reader}) OR (reader = #{writer} AND writer = #{reader})) ORDER BY sent DESC LIMIT 100")
    public List<HashMap<String, String>> getMessage(@Param("compId") String compId, @Param("writer") int writer , @Param("reader") String userNo, @Param("time") Date time);

    // 특정 발신자와의 신규 대화를 가져오는
    @Select("SELECT CAST(UNIX_TIMESTAMP(sent)*1000 AS CHAR) AS sent, message, related FROM bizcore.notes WHERE deleted IS NULL AND compId = #{compId} AND writer = #{writer} AND reader = #{reader} AND sent > (SELECT MAX(`read`) FROM bizcore.notes WHERE deleted IS NULL AND compId = #{compId} AND writer = #{writer} AND reader = #{reader}) ORDER BY sent desc")
    public List<HashMap<String, String>> getNewMessage(@Param("compId") String compId, @Param("writer") int writer , @Param("reader") String userNo);

    // 특정 발신자의 메시지에 대해 읽음 상태를 기록하는 메서드
    @Update("UPDATE bizcore.notes SET `read` = #{time} WHERE deleted IS NULL AND `read` IS NULL AND compId = #{compId} AND reader = #{reader} AND writer = #{writer}")
    public int setReadStatus(@Param("compId") String compId, @Param("writer") int writer , @Param("reader") String userNo, @Param("time") Date time);




    // 신규 메시지를 입력하는 메서드
    @Insert("INSERT INTO bizcore.notes(compId, no, writer, reader, message, related) VALUES(#{compId}, #{no}, #{writer}, #{reader}, #{msg}, #{related})")
    public int addNewNotes(@Param("compId") String compId, @Param("no") int no, @Param("writer") int writer, @Param("reader") int reader, @Param("msg") String msg, @Param("related") String related);

    // 특정 발신자의 신규 메시지를 가져오는 메서드
    @Select("SELECT CAST(writer AS CHAR) AS `writer`, CAST(UNIX_TIMESTAMP(sent)*1000 AS CHAR) AS sent, message FROM bizcore.notes WHERE deleted IS NULL AND `read` IS NULL AND compId = #{compId} AND writer = #{writer} AND reader = #{userNo} ORDER BY sent DESC")
    public List<HashMap<String, String>> getNewMessageWithWriter(@Param("compId") String compId, @Param("writer") int writer , @Param("userNo") String userNo);


}
