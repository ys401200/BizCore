package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.Notice;
import kr.co.bizcore.v1.domain.SimpleNotice;

public interface NoticeMapper {
    // 목록 전체 가져오는 쿼리 
    @Select("SELECT no, writer, title, created, modified FROM bizcore.notice WHERE compid = #{compId} AND deleted IS NULL ORDER BY no DESC")
    public List<SimpleNotice> getNotice(String compId);

    // 목록 일부 가져오는 쿼리 
    @Select("SELECT no, writer, title, created, modified FROM bizcore.notice WHERE compid = #{compId} AND deleted IS NULL  ORDER BY no DESC LIMIT #{start}, #{end}")
    public List<SimpleNotice> getNoticeWithStartAndEnd(@Param("compId") String compId, @Param("start") int start, @Param("end") int end );

    // 게시글 숫자를 가져오는 메서드
    @Select("SELECT count(*) FROM bizcore.notice WHERE compid = #{compId} AND deleted IS NULL")
    public int getNoticeCount(@Param("compId") String compId);

    // 공지사항 삭제하는 쿼리 
    @Update("UPDATE bizcore.notice SET deleted = NOW() WHERE compid = #{compId} AND no = #{notiNo}") 
    public int delete(@Param("compId") String compId, @Param("notiNo") String notiNo);

    // 본문 가져오는 쿼리 
    @Select("SELECT a.no, a.compid AS compId, a.writer, b.username AS writerName, a.title, a.content, a.created, a.modified FROM bizcore.notice a, swc_user b WHERE compid = #{compId} and no = #{notiNo} AND a.writer = b.userno AND deleted IS NULL")
    public Notice getSelectedNotice(@Param("compId")String compId, @Param("notiNo") String notiNo); 

    // 공지사항 추가하는 쿼리 
    @Insert ("INSERT INTO bizcore.notice(no, compid, writer, title, content) VALUES(bizcore.notice_next_no(#{compId}), #{compId} , #{writer}, #{title}, #{content})")
    public int insert(@Param("compId") String compId, @Param("writer")String writer, @Param("title")String title, @Param("content")String content);

    // 공지사항 수정하는 쿼리 
    @Update ("UPDATE bizcore.notice SET title = #{title}, content = #{content}, modified = NOW() WHERE compid = #{compId} AND no = #{notiNo};")
    public int updateNotice(@Param("title") String title, @Param("content") String content, @Param("compId") String compId, @Param("notiNo")String notiNo);
    

   
    
}
/*
-- 공지사항 추가하는 쿼리
INSERT INTO bizcore.notice(no, comp_id, writer, title, content) VALUES(notice_next_no(회사코드), 회사코드,사번, 제목, 본문);

-- 공지시항 수정하는 쿼리
UPDATE bizcore.notice SET title = '', content = '', modified = NOW() WHERE comp_id = 회사코드 AND no = 글번호;

-- 공지사항 삭제하는 쿼리
UPDATE bizcore.notice SET deleted = NOW() WHERE comp_id = 회사코드 AND no = 글번호;

-- 목록 가져오는 쿼리
SELECT no, writer, title, created, modified FROM bizcore.notice WHERE comp_id = '' AND deleted IS NULL; 

-- 본문 가져오는 쿼리
SELECT a.no, a.comp_id AS compId, a.writer, b.username AS writerName, a.title, a.content, a.created, a.modified FROM bizcore.notice a, swc_user b WHERE comp_id = '' and no = ????? AND a.writer = b.userno AND deleted IS NULL; 
*/
