package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.Article;
import kr.co.bizcore.v1.domain.SimpleArticle;

public interface BoardMapper {

    @Select("SELECT no, writer, title, IFNULL(modified, created) AS created FROM filebox WHERE deleted IS NULL AND comp_id = #{compId} ORDER BY no")
    public List<SimpleArticle> getFileboxList(String compId);

    @Select("SELECT filebox_next_no(#{compId})")
    public int getNewFileboxNo(String compId);    

    @Insert("INSERT INTO filebox(comp_id, no, writer, title, content) VALUES(#{compId}, #{article.no}, #{article.writer}, #{article.title}, #{article.content})")
    public void insertNewFileboxArticle(String compId, Article article);

    @Insert("INSERT INTO filebox_attached(comp_id, article_no, ogn_name, saved_name, size) VALUES()")
    public void addFileboxAttachedFile(String compId, int articleNo, String ognName, String savedName, long size);
}
