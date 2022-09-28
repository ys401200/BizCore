package kr.co.bizcore.v1.mapper;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

public interface GwMapper {

    // 부서코드와 연도를 입력받아서 다음 문서번호를 만들어주는 메서드
    @Select("SELECT LPAD(IFNULL(RIGHT(MAX(docno),4),0)+1,4,'0') FROM bizcore.doc_app WHERE compId = #{compId} AND docno LIKE #{like}")
    public String getNextDocNo(@Param("compId") String compId, @Param("like") String likeStr);
    
    // 신규 기안 문서의 헤더 정보를 입력하는 메서드
    @Insert("INSERT INTO bizcore.doc_app(no, compId, docno, writer, dept, docbox, title, formId, readable, status, created) VALUES(#{no}, #{compId}, #{docNo}, #{writer}, #{dept}, #{dept}, #{title}, #{formId}, #{readable}, 1, NOW())")
    public int addNewDocHeader(@Param("no") int no, @Param("compId") String compId, @Param("docNo") String docno, @Param("writer") String writer, @Param("dept") String dept, @Param("title") String title, @Param("formId") String formId, @Param("readable") String readabde);

    // 신규 기안문서의 결재선과 문서 본문을 저장하는 메서드
    @Insert("INSERT INTO bizcore.doc_app_detail(compId, docNo, ordered, employee, appType, doc, appData) VALUES(#{compId}, #{docNo}, #{ordered}, #{employee}, #{appType}, #{doc}, #{appData})")
    public int addNewDocAppLine(@Param("compId") String compId, @Param("docNo") String docNo, @Param("ordered") int ordered, @Param("employee") String employee, @Param("appType") String appType, @Param("doc") String doc, @Param("appData") String appData);


    @Insert("INSERT INTO bizcore.doc_app_detail(compId, docNo, ordered, employee, appType, doc, appData, `read`, approved) VALUES(#{compId}, #{docNo}, #{ordered}, #{employee}, #{appType}, #{doc}, #{appData}, NOW(), NOW())")
    public int addNewDocAppLineForSelf(@Param("compId") String compId, @Param("docNo") String docNo, @Param("ordered") int ordered, @Param("employee") String employee, @Param("appType") String appType, @Param("doc") String doc, @Param("appData") String appData);

    // 결재 대기 및 예정문서의 문서 번호를 가져오는 메서드
    @Select("SELECT a.docno, IF(a.apptype=4,'refer',IF(a.ordered=b.ordered,'wait','due')) AS stat FROM bizcore.doc_app_detail a, " +
            "(SELECT compId, docno, MIN(ordered) AS ordered FROM bizcore.doc_app_detail WHERE approved IS NULL AND rejected IS NULL AND compId=#{compId} AND docno IN (SELECT docno FROM bizcore.doc_app WHERE status = 1 AND compid=#{compId}) GROUP BY docno, compId) b " +
            "WHERE a.deleted IS NULL AND a.compId=b.compId AND a.docno = b.docno AND a.employee=#{userNo} AND a.approved IS NULL AND a.rejected IS NULL  AND a.apptype IN (0,2,4)")
    public List<HashMap<String, String>> getWaitAndDueDocNo(@Param("compId") String compId, @Param("userNo") String userNo);

    // 결재 대기 및 예정문서의 목록을 가져오는 메서드
    @Select("SELECT CAST(a.no AS CHAR) AS no, a.docno AS docno, CAST(a.writer AS CHAR) AS writer, CAST(UNIX_TIMESTAMP(a.created)*1000 AS CHAR) AS created, c.title AS form, a.title AS title, CAST(UNIX_TIMESTAMP(b.`read`)*1000 AS CHAR) AS `read`, CAST(b.apptype AS CHAR) AS appType FROM bizcore.doc_app a, bizcore.doc_app_detail b, bizcore.doc_form c WHERE b.deleted IS NULL AND c.id=a.formid AND a.compid=#{compId} AND b.employee=#{userNo} AND a.docno=b.docno AND b.ordered > 0 AND a.status=1 AND a.docno IN (#{sqlIn})")
    public List<HashMap<String, String>> getWaitAndDueList(@Param("compId") String compId, @Param("userNo") String userNo, @Param("sqlIn") String sqlIn);

    // 진행 중 문서 목록을 가져오는 메서드
    @Select("SELECT CAST(a.no AS CHAR) AS no, a.docNo, CAST(b.employee AS CHAR) AS authority, CAST(UNIX_TIMESTAMP(a.created)*1000 AS CHAR) AS created, c.title AS form, a.title AS title, CAST(UNIX_TIMESTAMP(b.`read`)*1000 AS CHAR) AS `read`, CAST(b.apptype AS CHAR) AS appType " +
            "FROM bizcore.doc_app a, bizcore.doc_app_detail b, bizcore.doc_form c, " +
            "(SELECT compId, docNo, MIN(ordered) AS ordered FROM bizcore.doc_app_detail WHERE approved IS NULL AND rejected IS NULL AND compId = #{compId} AND apptype < 4 GROUP BY docNo, compId) d " +
            "WHERE b.deleted IS NULL AND b.compId = d.compId AND b.docNo = d.docNo AND b.ordered = d.ordered AND b.docNo = a.docNo AND a.formId = c.id AND a.writer = #{userNo} ORDER BY created")
    public List<HashMap<String, String>> getProceedingDocList(@Param("compId") String compId, @Param("userNo") String userNo);

    // 결재문서의 읽은 시간을 set하는 메서드
    @Update("UPDATE bizcore.doc_app_detail SET `read` = NOW() WHERE deleted IS NULL AND compId = #{compId} AND docNo = #{docNo} AND employee = #{userNo} AND `read` IS NULL AND (ordered = (SELECT MIN(ordered) FROM bizcore.doc_app_detail WHERE compId = #{compId} AND docNo = #{docNo} AND approved IS NULL AND rejected IS NULL) OR appType = 4)")
    public void setDocReadTime(@Param("compId") String compId, @Param("userNo") String userNo, @Param("docNo") String docNo);

    // 결재문서의 변경 내역을 가져오는 메서드
    @Select("SELECT CAST(employee AS CHAR) AS employee, CAST(UNIX_TIMESTAMP(created)*1000 AS CHAR) AS created, content FROM bizcore.doc_app_revision WHERE compId = #{compId} AND docNo = #{docNo} ORDER BY created")
    public List<HashMap<String, String>> getRevisionHistory(@Param("compId") String compId, @Param("docNo") String docNo);

    // 결재문서의 수정 이력을 등록하는 매서드
    @Insert("INSERT INTO bizcore.doc_app_revision(compId, docNo, ordered, employee, content) VALUES(#{compId}, #{docNo}, #{ordered}, #{employee}, #{content})")
    public int addRevisionHistory(@Param("compId") String compId, @Param("docNo") String docNo, @Param("ordered") int ordered, @Param("employee") int employee, @Param("content") String content);

    // 문서번호를 입력받아서 작성자와 일련번호를 전달하느 메서드
    @Select("SELECT CAST(no AS CHAR) AS no, CAST(writer AS CHAR) AS writer FROM bizcore.doc_app WHERE deleted IS NULL AND compId = #{compId} AND docNo = #{docNo}")
    public HashMap<String, String> getAppDocWriterAndSN(@Param("compId") String compId, @Param("docNo") String docNo);

    // 결재선에 반려처리를 기록하는 메서드
    @Update("UPDATE bizcore.doc_app_detail SET rejected = NOW() WHERE compId = #{compId} AND docNo = #{docNo} AND ordered = #{ordered}")
    public int setDocAppLineRejected(@Param("compId") String compId, @Param("docNo") String docNo, @Param("ordered") int ordered);

    // 결재문서를 반려처리하는 메서드
    @Update("UPDATE bizcore.doc_app SET status = -3 WHERE compId = #{compId} AND docNo = #{docNo}")
    public int setDocAppRejected(@Param("compId") String compId, @Param("docNo") String docNo);

    // 결재처리시 본문이 수정된 경우 이를 반영하는 메서드
    @Update("UPDATE bizcore.doc_app_detail SET doc = #{doc}, isModify = 1 WHERE compId = #{compId} AND docNo = #{docNo} AND ordered = #{ordered}")
    public int updateAppDocContent(@Param("compId") String compId, @Param("docNo") String docNo, @Param("ordered") int ordered, @Param("doc") String doc);

    // 결재처리시 수정되었음을 결재선에 세팅하는 메서드
    @Update("UPDATE bizcore.doc_app_detail SET isModify = 1 WHERE compId = #{compId} AND docNo = #{docNo} AND ordered = #{ordered}")
    public int setModifiedAppLine(@Param("compId") String compId, @Param("docNo") String docNo, @Param("ordered") int ordered);

    // 결재처리시 결재선이 수정된 경우 수정자 이후의 결재선을 삭제처리하는 메서드
    @Update("UPDATE bizcore.doc_app_detail SET deleted = NOW() WHERE compId = #{compId} AND docNo = #{docNo} AND ordered > #{ordered}")
    public int deleteAppLineSinceEditAppline(@Param("compId") String compId, @Param("docNo") String docNo, @Param("ordered") int ordered);

    // ordered 기준, 요청자가 승인 권한이 있는지 여부 및 결재 타입을 가져오는 메서드
    @Select("SELECT CAST(employee AS CHAR) AS employee, CAST(appType AS CHAR) AS appType FROM bizcore.doc_app_detail WHERE deleted IS NULL AND compId = #{compId} AND docNo = #{docNo} AND ordered = #{ordered}")
    public HashMap<String, String> getAppTypeAndEmployee(@Param("compId") String compId, @Param("docNo") String docNo, @Param("ordered") int ordered);

    // 결재처리시, 결재선 변경 중 현재 결재 타입을 변경처리하는 메서드
    @Update("UPDATE bizcore.doc_app_detail SET appType = #{appType} WHERE compId = #{compId} AND docNo = #{docNo} AND ordered > #{ordered}")
    public int changeAppType(@Param("compId") String compId, @Param("docNo") String docNo, @Param("ordered") int ordered, @Param("appType") int appType);

    // 결재문서의 리비전 히스토리를 기록하는 메서드
    @Insert("INSERT INTO bizcore.doc_app_revision(compId, docNo, ordered, employee, content) VALUES(#{compId}, #{docNo}, #{ordered}, #{employee}, #{content})")
    public int addRevisionHistory2(@Param("compId") String compId, @Param("docNo") String docNo, @Param("ordered") int ordered, @Param("employee") String userNo , @Param("content") String revision);

    // 결재선에 결재처리를 기록하는 메서드
    @Update("UPDATE bizcore.doc_app_detail SET approved = NOW(), comment = #{comment}, appData = #{appData} WHERE deleted IS NULL AND compId = #{compId} AND docNo = #{docNo} AND ordered = #{ordered}")
    public int setProceedDocAppStatus(@Param("compId") String compId, @Param("docNo") String docNo, @Param("ordered") int ordered, @Param("comment") String comment, @Param("appData") String appData);

    // 다음 결재자 정보를 가져오는 메서드
    @Select("SELECT employee, appType FROM bizcore.doc_app_detail WHERE deleted IS NULL AND appType < 4 AND compId = #{compId} AND docNo = #{docNo} AND ordered > (SELECT min(ordered) FROM bizcore.doc_app_detail WHERE deleted IS NULL AND appType < 4 AND compId = #{compId} AND docNo = #{docNo} AND ordered > #{ordered})")
    public HashMap<String, Integer> getNextAppData(@Param("compId") String compId, @Param("docNo") String docNo, @Param("ordered") int ordered);
}
