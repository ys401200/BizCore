package kr.co.bizcore.v1.mapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.SimpleCustomer;

public interface CommonMapper {

    @Select("SELECT custno AS no, custname AS name, custvatno AS businessRegistrationNumber, custbossname AS ceoName FROM swcore.swc_cust WHERE compno = (SELECT compno FROM swcore.swc_company WHERE compid = #{compId})")
    public List<SimpleCustomer> getCustomerList(String compId);

    @Select("SELECT comname, comaddress, comphone, comfax, comboss FROM swcore.swc_cominfo WHERE compno = (SELECT compno FROM swcore.swc_company WHERE compid = #{compId}) limit 1")
    public Map<String, String> getCompanyInfo(String compId);

    @Select("SELECT codeno AS code, desc03 AS name FROM swcore.swc_code WHERE desc03 IS NOT NULL AND compno = (SELECT compno FROM swcore.swc_company WHERE compid = #{compId})")
    public List<HashMap<String, String>> getCommonCode(String compId);    
}
