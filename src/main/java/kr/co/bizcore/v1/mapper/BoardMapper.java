package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.Article;
import kr.co.bizcore.v1.domain.AttachedFile;
import kr.co.bizcore.v1.domain.SimpleArticle;

public interface BoardMapper {

    // 자료실 게시글 전체
    @Select("SELECT no, writer, title, IFNULL(modified, created) AS created FROM bizcore.filebox WHERE deleted IS NULL AND compId = #{compId} ORDER BY no DESC")
    public List<SimpleArticle> getFileboxList(String compId);

    // 자료실 게시글 시작과 끝 번호 입력
    @Select("SELECT no, writer, title, IFNULL(modified, created) AS created FROM bizcore.filebox WHERE deleted IS NULL AND compId = #{compId} ORDER BY no DESC LIMIT #{start}, #{end}")
    public List<SimpleArticle> getFileboxListWithStartEnd(@Param("compId") String compId, @Param("start") int start, @Param("end") int end);

    // 자료실 게시글 숫자 카운트
    @Select("SELECT count(*) AS ct FROM bizcore.filebox WHERE deleted IS NULL AND compId = #{compId}")
    public int getFileboxArticleCount(@Param("compId") String compId);

    @Select("SELECT no, writer, title, content, created, modified FROM bizcore.filebox WHERE no = #{no} AND compId = #{compId} AND deleted IS NULL")
    public Article getFileboxArticle(@Param("no") int no, @Param("compId") String compId);

    @Select("SELECT idx, articleNo, savedName, ognName, created, modified, size, removed FROM bizcore.filebox_attached WHERE articleNo = #{no} AND compId = #{compId} AND deleted IS NULL")
    public List<AttachedFile> getAttachedFileList(@Param("no") int articleNo, @Param("compId") String compId);

    @Select("SELECT bizcore.filebox_next_no(#{compId})")
    public int getNewFileboxNo(String compId);    

    @Insert("INSERT INTO bizcore.filebox(compId, no, writer, title, content) VALUES(#{compId}, #{article.no}, #{article.writer}, #{article.title}, #{article.content})")
    public void insertNewFileboxArticle(@Param("compId") String compId, @Param("article")Article article);

    @Insert("INSERT INTO bizcore.filebox_attached(compId, articleNo, ognName, savedName, size) VALUES(#{compId}, #{articleNo}, #{ognName}, #{savedName}, #{size})")
    public void addFileboxAttachedFile(@Param("compId") String compId, @Param("articleNo") int articleNo, @Param("ognName") String ognName, @Param("savedName") String savedName, @Param("size") long size);

    @Update("UPDATE bizcore.filebox_attached SET deleted = NOW() WHERE articleno = #{articleNo} AND compid = #{compId} AND savedname = #{savedName}")
    public void deleteFileboxAttachedFile(@Param("articleNo") String articleNo, @Param("compId") String compId, @Param("savedName") String savedName);

    @Update("UPDATE bizcore.filebox SET deleted = NOW() WHERE no = #{no} AND compid = #{compId}")
    public void deleteFileboxArticle(@Param("no") String articleNo, @Param("compId") String compId);

    @Update("UPDATE bizcore.filebox SET modified = NOW(), title = #{article.title}, content = #{article.content} WHERE no = #{article.no} AND compid = #{compId}")
    public void updateFileboxArticle(@Param("article") Article article, @Param("compId") String compId);

    @Select("SELECT savedname FROM bizcore.filebox_attached WHERE compid = #{compId} AND articleno = #{no} AND ognname = #{fileName} AND deleted is NULL")
    public String getFileboxSavedFileName(@Param("compId") String compId, @Param("no") String no, @Param("fileName") String fileName);

    @Insert("INSERT INTO bizcore.filebox_attached(articleno, compid, ognname, savedname, created, size) VALUES(#{attachedFile.articleNo}, #{compId}, #{attachedFile.ognName}, #{attachedFile.savedName}, now(), #{attachedFile.size})")
    public void addAttachedFile(@Param("compId") String compId, @Param("attachedFile") AttachedFile attachedFile);
}
