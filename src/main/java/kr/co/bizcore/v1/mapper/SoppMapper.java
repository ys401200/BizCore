package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.SimpleSopp;

public interface SoppMapper {

    @Select("SELECT soppno AS no, sopptype AS soppType, cntrctmth AS contType, sopptitle AS title, buyrno AS customer, custno AS endUser, userno AS employee, sopptargetamt AS expectedSales, soppstatus AS progress, regdatetime AS created, moddatetime AS modified " +
        "FROM swcore.swc_sopp " + 
        "WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swcore.swc_company WHERE compid = #{compId}) ORDER BY soppno DESC")
    public List<SimpleSopp> getSoppList(String compId);
    
}
