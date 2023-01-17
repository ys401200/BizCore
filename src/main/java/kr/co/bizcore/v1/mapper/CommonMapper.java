package kr.co.bizcore.v1.mapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.Customer;
import kr.co.bizcore.v1.domain.Product;
import kr.co.bizcore.v1.domain.SimpleCustomer;

public interface CommonMapper {

    @Select("SELECT no, name, taxId, ceoName FROM bizcore.customer WHERE deleted IS NULL AND compId = #{compId}")
    public List<SimpleCustomer> getCustomerList(String compId);

    @Update("UPDATE bizcore.customer SET deleted = NOW() WHERE deleted IS NULL AND compId = #{compId} AND no = #{no}")
    public int removeCustomer(@Param("compId") String compId, @Param("no") int no);

    @Select("SELECT no, name, taxId, email, emailForTaxbill, zipCode, address, phone, fax, ceoName, typeOfBusiness, itemsOfBusiness, remark1, remark2, ci_manufacturer, ci_partner, ci_public, ci_civilian, tos_directProcument, tos_indirectProcument, tos_agencyProcument, tos_maintenance, tos_generalCompany, tos_hospital, tos_finance, tos_public, ti_supplier, ti_partner, ti_client, ti_notTrade, related, created, modified FROM bizcore.customer WHERE deleted IS NULL AND compId = #{compId} AND `no` = #{no}")
    public Customer getCustomeByNo(@Param("compId") String compId, @Param("no") int no);

    @Select("SELECT no, name, taxId, email, emailForTaxbill, zipCode, address, phone, fax, ceoName, typeOfBusiness, itemsOfBusiness, remark1, remark2, ci_manufacturer, ci_partner, ci_public, ci_civilian, tos_directProcument, tos_indirectProcument, tos_agencyProcument, tos_maintenance, tos_generalCompany, tos_hospital, tos_finance, tos_public, ti_supplier, ti_partner, ti_client, ti_notTrade, related, created, modified FROM bizcore.customer WHERE deleted IS NULL AND compId = #{compId} AND taxId = #{taxId}")
    public Customer getCustomeByTaxId(@Param("compId") String compId, @Param("taxId") String taxId);

    @Select("SELECT name, ceo, corpregno, taxid, CAST(zipcode AS CHAR) zipcode, address, contact, fax, email, CAST(UNIX_TIMESTAMP(created)*1000 AS CHAR) created, CAST(UNIX_TIMESTAMP(modified)*1000 AS CHAR)modified FROM bizsys.companies WHERE compId = #{compId}")
    public Map<String, String> getCompanyInfo(String compId);

    @Select("SELECT codeno AS code, desc03 AS name FROM swc_code WHERE desc03 IS NOT NULL AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId})")
    public List<HashMap<String, String>> getCommonCode(String compId);

    @Select("SELECT desc01 AS a, value01 AS b, code01 AS c " +
            "FROM swc_code " + 
            "WHERE (code02 IS NULL OR code02 = '') AND attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId})")
    public List<HashMap<String, String>> getCommonCodeLevel1(@Param("compId") String compId);

    @Select("SELECT desc02 AS a, value02 AS b, code02 AS c " +
            "FROM swc_code " + 
            "WHERE NOT (code02 IS NULL OR code02 = '') AND (code03 IS NULL OR code03 = '') AND code01 = #{selector} " +
            "AND attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId})")
    public List<HashMap<String, String>> getCommonCodeLevel2(@Param("selector") String selector, @Param("compId") String compId);

    @Select("SELECT desc03 AS a, value03 AS b, code03 AS c " +
            "FROM swc_code " +
            "WHERE NOT (code03 IS NULL OR code03 = '') AND code02 = #{selector} " +
            "AND attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId})")
    public List<HashMap<String, String>> getCommonCodeLevel3(@Param("selector") String selector, @Param("compId") String compId);

    @Select("SELECT compid FROM swc_company WHERE compno NOT IN (100001, 100003)")
    public List<String> companyList();

    @Select("SELECT CAST(codeno AS char) AS no, desc03 AS value FROM swc_code WHERE attrib NOT LIKE 'XXX%' AND desc03 IS NOT NULL AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId})")
    public List<HashMap<String, String>> getEtcCode(String compId);

    @Select("SELECT CAST(custdata03no AS char) AS no, custmname AS name, CAST(custno AS char) AS cust, custmrank AS rank FROM swcore.swc_custdata03 WHERE attrib NOT LIKE 'XXX%'")
    public List<HashMap<String, String>> getCipInfo();

    @Select("SELECT custmname FROM swcore.swc_custdata03 WHERE custdata03no = #{no} AND attrib NOT LIKE 'XXX%'")
    public String getCipName(String no);

    @Select("SELECT no, category, categoryName, supplier, writer, name, `desc`, price, created, modified FROM bizcore.product WHERE deleted IS NULL AND compId = #{compId} ORDER BY no")
    public List<Product> getProductList(@Param("compId") String compId);

    @Insert("INSERT INTO bizcore.product (compId, no, category, categoryName, supplier, writer, name, `desc`, price, created) VALUES(#{compId}, #{p.no}, #{p.category}, #{p.categoryName}, #{p.supplier}, #{p.writer}, #{p.name}, #{p.desc}, #{p.price}, NOW())")
    public int addProduct(@Param("compId") String compId, @Param("p") Product product);

    // 연차 사용 현황
    @Select("SELECT CAST(unix_timestamp(`START`)*1000 AS CHAR) AS `start`, CAST(unix_timestamp(`END`)*1000 AS CHAR) AS `end`, CAST(used AS CHAR) AS used FROM bizcore.annual_leave WHERE deleted IS NULL AND compId = #{compId} AND employee = #{userNo} AND `end` > (SELECT CAST(CONCAT(IF(tm*100+td < jm*jd, ty-1, ty),'-',jm,'-',jd) AS DATETIME) AS refdt FROM (SELECT MONTH(joined) jm, DAY(joined) jd, YEAR(DATE_ADD(NOW(), INTERVAL 9 HOUR)) ty , MONTH(DATE_ADD(NOW(), INTERVAL 9 HOUR)) tm, DAY(DATE_ADD(NOW(), INTERVAL 9 HOUR)) td FROM bizcore.users WHERE NO = #{userNo}) z)  ORDER BY `start`")
    public List<HashMap<String, String>> getUsedAnnualLeave(@Param("compId") String compId, @Param("userNo") int employee);

    // 권한 확인
    @Select("SELECT dept, func_id sub, CAST(permission AS CHAR) perm FROM bizcore.permission WHERE permission > 0 AND comp_id = #{compId} AND ((dept = #{dept} AND func_id IN ('head', 'doc')) OR (dept = 'all' AND func_id IN ('manager', 'accounting', 'hr', 'docmng'))) AND user_no = #{employee}")
    public List<HashMap<String, String>> getPermissionWithDept(@Param("compId") String compId, @Param("dept") String dept, @Param("employee") int employee);

    // 법인카드 목록과 사용자를 가져오는 메서드
    @Select("SELECT c.card, c.div, c.bank, CAST(c.hipass AS CHAR) hipass, CAST(d.e AS CHAR) employee " +
            "FROM bizcore.corporate_card c " +
            "LEFT JOIN (SELECT a.employee e, a.card c " +
            "        FROM bizcore.corporate_card_history a, " +
            "        (SELECT card, MAX(issued) i " +
            "        FROM bizcore.corporate_card_history " +
            "        WHERE retrieved IS NULL AND compId = #{compId} " +
            "        GROUP BY card) b " +
            "        WHERE a.card = b.card AND a.issued = b.i) d ON c.card = d.c " +
            "WHERE c.deleted IS NULL AND c.status = '정상' AND c.compId = #{compId}")
    public List<HashMap<String, String>> getCorporateCardList(@Param("compId") String compId);

    // 법인차량 목록과 사용자를 가져오는 메서드
    @Select("SELECT c.vehicle, c.model, CAST(d.e AS CHAR) employee " +
        "FROM bizcore.corporate_vehicle c " +
        "  LEFT JOIN (SELECT a.employee e, a.vehicle v " +
        "    FROM bizcore.corporate_vehicle_history a, " +
        "    (SELECT vehicle, MAX(issued) i " +
        "      FROM bizcore.corporate_vehicle_history " +
        "      WHERE retrieved IS NULL AND compId = #{compId} " +
        "      GROUP BY vehicle) b " +
        "    WHERE a.vehicle = b.vehicle AND a.issued = b.i) d ON c.vehicle = d.v " +
        "WHERE c.deleted IS NULL AND c.status = '정상' AND c.compId = #{compId}")
    public List<HashMap<String, String>> getCorporateVehicleList(@Param("compId") String compId);

    // 부서코드 존재유무 검증 메서드
    @Select("SELECT count(*) FROM bizcore.department WHERE deleted IS NULL AND compId = #{compId} AND deptid = #{deptId}")
    public int verifyDeptId(@Param("compId") String compId, @Param("deptId") String deptId);

    // 인사 권한(hr 또는 manager) 확인 메서드
    @Select("SELECT sum(permission) FROM bizcore.permission WHERE comp_id = #{compId} AND dept = 'all' AND func_id IN ('manager', 'hr') AND user_no = #{userNo}")
    public int checkHrPermission(@Param("compId") String compId, @Param("userNo") String userNo);

    // 부서 추가 메서드
    @Insert("INSERT INTO bizcore.department(compId, deptName, deptId, parent, created) values(#{compId}, #{deptName}, #{deptId}, #{parent}, now())")
    public int addNewDept(@Param("compId") String compId, @Param("deptName") String deptName, @Param("deptId") String deptId, @Param("parent") String parent);
}
