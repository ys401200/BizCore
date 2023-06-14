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
    @Select("SELECT * FROM swc_notice WHERE compNo = #{compNo} AND attrib not like 'XXX%' ORDER BY noticeNo DESC")
    public List<SimpleNotice> getNotice(int compNo);

    // 목록 일부 가져오는 쿼리 
    @Select("SELECT no, writer, title, created, modified FROM bizcore.notice WHERE compid = #{compId} AND deleted IS NULL  ORDER BY no DESC LIMIT #{start}, #{end}")
    public List<SimpleNotice> getNoticeWithStartAndEnd(@Param("compId") String compId, @Param("start") int start, @Param("end") int end );

    // 게시글 숫자를 가져오는 메서드
    @Select("SELECT count(*) FROM bizcore.notice WHERE compid = #{compId} AND deleted IS NULL")
    public int getNoticeCount(@Param("compId") String compId);

    // 공지사항 삭제하는 쿼리 
    @Update("UPDATE swc_notice SET modDate = NOW(), attrib = 'XXXXX' WHERE compNo = #{compNo} AND noticeNo = #{noticeNo}") 
    public int delete(@Param("compNo") int compNo, @Param("noticeNo") String noticeNo);

    // 본문 가져오는 쿼리 
    @Select("SELECT * FROM swc_notice WHERE compNo = #{compNo} and noticeNo = #{noticeNo}")
    public Notice getSelectedNotice(@Param("compNo")int compNo, @Param("noticeNo") String noticeNo); 

    // 공지사항 추가하는 쿼리 
    @Insert ("INSERT INTO swc_notice(compNo, userNo, noticeTitle, noticeContents, regDate) VALUES(#{compNo}, #{userNo}, #{noticeTitle}, #{noticeContents}, now())")
    public int insert(@Param("compNo") int compNo, @Param("userNo")String userNo, @Param("noticeTitle")String noticeTitle, @Param("noticeContents")String noticeContents);

    // 공지사항 수정하는 쿼리 
    @Update ("UPDATE swc_notice SET noticeTitle = #{noticeTitle}, noticeContents = #{noticeContents}, modDate = NOW() WHERE compNo = #{compNo} AND noticeNo = #{noticeNo};")
    public int updateNotice(@Param("noticeTitle") String noticeTitle, @Param("noticeContents") String noticeContents, @Param("compNo") int compNo, @Param("noticeNo")String noticeNo);
    

   
    
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
