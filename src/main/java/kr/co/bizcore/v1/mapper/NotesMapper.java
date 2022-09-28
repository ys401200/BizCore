package kr.co.bizcore.v1.mapper;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

public interface NotesMapper {
    
    // 읽지 않은 전체 메시지를 카운트하는 메서드
    @Select("SELECT COUNT(*) FROM bizcore.notes WHERE deleted IS NULL AND compId = #{compId} AND reader = #{userNo}")
    public int getUnreadNoteCount(@Param("compId") String compId, @Param("userNo") String userNo);

    // 발신자별 읽지 않은 메시지를 카운트하는 메서드
    @Select("SELECT a.writer, a.`count` FROM (SELECT writer, COUNT(*) AS `count` FROM bizcore.notes WHERE deleted IS NULL AND compId = #{compId} AND reader = #{userNo} GROUP BY writer) a WHERE `count` > 0 ORDER BY `count` desc")
    public HashMap<String, Integer> getUnreadNptesDevideWriter(@Param("compId") String compId, @Param("userNo") String userNo);

    // 신규 메시지를 입력하는 메서드
    @Insert("INSERT INTO bizcore.notes(compId, no, writer, reader, message, related) VALUES(#{compId}, #{no}, #{writer}, #{reader}, #{msg}, #{related})")
    public int addNewNotes(@Param("compId") String compId, @Param("no") int no, @Param("writer") int writer, @Param("reader") int reader, @Param("msg") String msg, @Param("related") String related);

    // 특정 발신자의 신규 메시지를 가져오는 메서드
    @Select("SELECT CAST(writer AS CHAR) AS `writer`, CAST(UNIX_TIMESTAMP(sent)*1000 AS CHAR) AS sent, message FROM bizcore.notes WHERE deleted IS NULL AND `read` IS NULL AND compId = #{compId} AND writer = #{writer} AND reader = #{userNo} ORDER BY sent DESC")
    public List<HashMap<String, String>> getNewMessageWithWriter(@Param("compId") String compId, @Param("writer") int writer , @Param("userNo") String userNo);

    // 전체 발신자의 신규 메시지를 가져오는 메서드
    @Select("SELECT CAST(writer AS CHAR) AS writer, CAST(UNIX_TIMESTAMP(sent)*1000 AS CHAR) AS sent, message FROM bizcore.notes WHERE deleted IS NULL AND `read` IS NULL AND compId = #{compId} AND reader = #{userNo} ORDER BY sent DESC")
    public List<HashMap<String, String>> getAllNewMessage(@Param("compId") String compId, @Param("userNo") String userNo);

    // 특정 발신자와의 대화를 가져오는
    @Select("SELECT CAST(writer AS CHAR) AS `writer`, CAST(UNIX_TIMESTAMP(sent)*1000 AS CHAR) AS sent, CAST(UNIX_TIMESTAMP(`read`)*1000 AS CHAR) AS `read`, message FROM bizcore.notes WHERE deleted IS NULL AND compId = #{compId} AND ((writer = #{writer} AND reader = #{reader}) OR (reader = #{writer} AND writer = #{reader})) ORDER BY sent DESC LIMIT #{start},#{end}")
    public List<HashMap<String, String>> getMessageWithWriter(@Param("compId") String compId, @Param("writer") int writer , @Param("reader") int userNo, @Param("start") int start, @Param("end") int end);

    // 특정 발신자의 메시지에 대해 읽음 상태를 기록하는 메서드
    @Update("UPDATE bizcore.notes SET `read` = NOW() WHERE deleted IS NULL AND `read` IS NULL AND compId = #{compId} AND reader = #{userNo} AND writer = #{writer}")
    public int setReadStatus(@Param("compId") String compId, @Param("writer") int writer , @Param("reader") int userNo);
}
