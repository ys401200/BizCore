package kr.co.bizcore.v1.mapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.SimpleCustomer;

public interface CommonMapper {

    @Select("SELECT custno AS no, custname AS name, custvatno AS businessRegistrationNumber, custbossname AS ceoName FROM swc_cust WHERE compno = (SELECT compno FROM swc_company WHERE compid = #{compId})")
    public List<SimpleCustomer> getCustomerList(String compId);

    @Select("SELECT comname, comaddress, comphone, comfax, comboss FROM swc_cominfo WHERE compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) limit 1")
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

    @Select("SELECT custmname FROM swcore.swc_custdata03 WHERE no = #{no} AND attrib NOT LIKE 'XXX%'")
    public String getCipName(String no);
}
