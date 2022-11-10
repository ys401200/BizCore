package kr.co.bizcore.v1.mapper;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

public interface EstimateMapper {
    
    // 견적 양식을 가져오는 메서드
    @Select("SELECT CAST(a.no AS CHAR) AS no, a.name, CAST(a.version AS CHAR) AS version, CAST(a.width AS CHAR) AS width, CAST(a.height AS CHAR) AS height, a.form, a.remark FROM bizcore.estimate_form a, (SELECT name, MAX(version) AS v FROM bizcore.estimate_form WHERE deleted IS NULL AND compId = #{compId} GROUP BY name) b WHERE deleted IS NULL AND compId = #{compId} AND a.name = b.name AND a.version = b.v")
    public List<HashMap<String, String>> getEstimateFormList(@Param("compId") String compId);

    // 제품(Item) 목록을 가져오는 메서드
    @Select("SELECT CAST(productno AS CHAR) AS no, productcategoryname AS category, CAST(custno AS CHAR) AS supplier, productname AS product, productdesc AS `desc`, CAST(productdefaultprice AS CHAR) AS price FROM swcore.swc_product WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swcore.swc_company WHERE compid = #{compId})")
    public List<HashMap<String, String>> getItems(@Param("compId") String compId);

    // 견적 최종버전 기준 목록을가져오는 메서드
    @Select("SELECT a.estmno AS no, formName AS form, title, CAST(version AS CHAR) AS version, CAST(UNIX_TIMESTAMP(dt) * 1000 AS CHAR) AS dt FROM bizcore.estimate a, (SELECT estmno, max(version) v FROM bizcore.estimate WHERE deleted IS NULL AND compid = #{compId} GROUP BY estmno) c WHERE deleted IS NULL AND compId = #{compId} AND a.estmno = c.estmno AND a.version = c.v ORDER BY created DESC")
    public List<HashMap<String, String>> getEstmList(@Param("compId") String compId);

    // 견적 버전 목록을 가져오는 메서드
    @Select("SELECT estmNo AS no, formName AS form, title, CAST(version AS CHAR) version, CAST(UNIX_TIMESTAMP(dt) * 1000 AS CHAR) AS dt, `exp`, CAST(writer AS CHAR) AS writer, doc, CAST(width AS CHAR) AS width, CAST(height AS CHAR) AS height, remarks, related FROM bizcore.estimate a WHERE deleted IS NULL AND compId = #{compId} AND estmNo = #{no} ORDER BY version")
    public List<HashMap<String, String>> getEstmVersionList(@Param("compId") String compId, @Param("no") String estmNo);

    // 견적의 기본정보를 가여오는 메서드
    @Select("SELECT CAST(no AS CHAR) AS no, name, firmName, representative, address, phone, fax FROM bizcore.estimate_basic_info WHERE compId = #{compId}  ORDER BY no")
    public List<HashMap<String, String>> getEstmBasicInfo(@Param("compId") String compId);

    @Select("SELECT related FROM bizcore.estimate a WHERE deleted IS NULL AND compId = #{compId} AND estmNo = #{no} AND version = (SELECT max(version) FROM bizcore.estimate WHERE deleted IS NULL AND compId = #{compId} AND estmNo = #{no})")
    public String getLastEstmData(@Param("compId") String compId, @Param("no") String estmNo);

    @Select("SELECT related FROM bizcore.estimate a WHERE deleted IS NULL AND compId = #{compId} AND estmNo = #{no} AND version = #{version}")
    public String getEstmVerData(@Param("compId") String compId, @Param("no") String estmNo, @Param("version") int version);
}
