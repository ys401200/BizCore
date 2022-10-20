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
}
