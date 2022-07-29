package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.SimpleSopp;
import kr.co.bizcore.v1.domain.Sopp;

public interface SoppMapper {

    @Select("SELECT soppno AS no, sopptype AS soppType, cntrctmth AS contType, sopptitle AS title, buyrno AS customer, custno AS endUser, userno AS employee, sopptargetamt AS expectedSales, soppstatus AS status, regdatetime AS created, moddatetime AS modified " +
        "FROM swc_sopp " + 
        "WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY soppno DESC")
    public List<SimpleSopp> getSoppList(String compId);

    @Select("SELECT soppno AS no, sopptype AS soppType, cntrctMth AS contType, sopptitle AS title, buyrno AS customer, custNo AS enduser, userNo AS employee, sopptargetamt AS expectedSales, soppstatus AS status, " + 
    "contno AS contract, (SELECT q.custMname FROM swc_custData03 q WHERE q.custData03no = custMemberNo) AS picOfCustomer, " + 
    "ptncno AS ptnc, ptncmemberno AS picOfPtnc, buyrmemberno AS picOfBuyer, soppDesc AS detail,  " + 
    "sopptargetdate AS targetDate, maintenance_s AS startOfMaintenance, maintenance_e AS endOfMaintenance, soppsrate AS progress, soppsource AS source, " + 
    "sopp2desc AS remark, sopp2regdatetime AS remarkDate, businessType, op_priority AS priority, regDatetime AS created, modDatetime AS modified " + 
    "FROM swc_sopp " + 
    "WHERE attrib NOT LIKE 'XXX%' " + 
    "AND soppno = #{soppNo} AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId})")
    public Sopp getSopp(@Param("soppNo") int soppNo, @Param("compId") String compId);
    
}
