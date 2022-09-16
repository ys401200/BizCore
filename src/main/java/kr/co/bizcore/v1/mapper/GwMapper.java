package kr.co.bizcore.v1.mapper;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

public interface GwMapper {

    @Select("SELECT LPAD(IFNULL(RIGHT(MAX(docno),4),0)+1,4,'0') FROM bizcore.doc_app WHERE compId = #{compId} AND docno LIKE #{like}")
    public String getNextDocNo(@Param("compId") String compId, @Param("like") String likeStr);
    
    @Insert("INSERT INTO bizcore.doc_app(no, compId, docno, writer, dept, docbox, title, formId, readable, status, created) VALUES(#{no}, #{compId}, #{docNo}, #{writer}, #{dept}, #{dept}, #{title}, #{formId}, #{readable}, 1, NOW())")
    public int addNewDocHeader(@Param("no") int no, @Param("compId") String compId, @Param("docNo") String docno, @Param("writer") String writer, @Param("dept") String dept, @Param("title") String title, @Param("formId") String formId, @Param("readable") String readabde);

    @Insert("INSERT INTO bizcore.doc_app_detail(compId, docNo, ordered, employee, appType, doc, appData) VALUES(#{compId}, #{docNo}, #{ordered}, #{employee}, #{appType}, #{doc}, #{appData})")
    public int addNewDocAppLine(@Param("compId") String compId, @Param("docNo") String docNo, @Param("ordered") int ordered, @Param("employee") String employee, @Param("appType") String appType, @Param("doc") String doc, @Param("appData") String appData);

    @Insert("INSERT INTO bizcore.doc_app_detail(compId, docNo, ordered, employee, appType, doc, appData, `read`, approved) VALUES(#{compId}, #{docNo}, #{ordered}, #{employee}, #{appType}, #{doc}, #{appData}, NOW(), NOW())")
    public int addNewDocAppLineForSelf(@Param("compId") String compId, @Param("docNo") String docNo, @Param("ordered") int ordered, @Param("employee") String employee, @Param("appType") String appType, @Param("doc") String doc, @Param("appData") String appData);

    @Select("SELECT a.docno, IF(a.apptype=4,'refer',IF(a.ordered=b.ordered,'wait','due')) AS stat FROM bizcore.doc_app_detail a, " +
            "(SELECT compId, docno, MIN(ordered) AS ordered FROM bizcore.doc_app_detail WHERE approved IS NULL AND rejected IS NULL AND compId=#{compId} AND docno IN (SELECT docno FROM bizcore.doc_app WHERE status = 1 AND compid=#{compId}) GROUP BY docno, compId) b " +
            "WHERE a.compId=b.compId AND a.docno = b.docno AND a.employee=#{userNo} AND a.approved IS NULL AND a.rejected IS NULL  AND a.apptype IN (0,1,4)")
    public List<HashMap<String, String>> getWaitAndDueDocNo(@Param("compId") String compId, @Param("userNo") String userNo);

    @Select("SELECT CAST(a.no AS CHAR) AS no, a.docno AS docno, CAST(a.writer AS CHAR) AS writer, CAST(UNIX_TIMESTAMP(a.created)*1000 AS CHAR) AS created, c.title AS form, a.title AS title, CAST(UNIX_TIMESTAMP(b.`read`)*1000 AS CHAR) AS `read`, CAST(b.apptype AS CHAR) AS appType FROM bizcore.doc_app a, bizcore.doc_app_detail b, bizcore.doc_form c WHERE c.id=a.formid AND a.compid=#{compId} AND b.employee=#{userNo} AND a.docno=b.docno AND a.status=1 AND a.docno IN (#{sqlIn})")
    public List<HashMap<String, String>> getWaitAndDueList(@Param("compId") String compId, @Param("userNo") String userNo, @Param("sqlIn") String sqlIn);

}
