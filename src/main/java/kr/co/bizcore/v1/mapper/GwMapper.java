package kr.co.bizcore.v1.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

public interface GwMapper {

    @Select("SELECT LPAD(IFNULL(RIGHT(MAX(docno),4),0)+1,4,'0') FROM bizcore.doc_app WHERE compId = #{compId} AND docno LIKE #{like}")
    public String getNextDocNo(@Param("compId") String compId, @Param("like") String likeStr);
    
    @Insert("INSERT INTO bizcore.doc_app(no, compId, docno, writer, dept, docbox, title, status, created) VALUES(#{no}, #{compId}, #{docno}, #{writer}, #{dept}, #{dept}, #{title}, 1, NOW())")
    public int addNewDocHeader(@Param("no") int no, @Param("compId") String compId, @Param("docNo") String docno, @Param("writer") String writer, @Param("dept") String dept, @Param("title") String title);
}
