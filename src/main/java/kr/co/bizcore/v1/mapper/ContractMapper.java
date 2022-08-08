package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.Contract;
import kr.co.bizcore.v1.domain.SimpleContract;

public interface ContractMapper {
    
    @Select("SELECT contno AS no, conttype AS salesType, cntrctmth AS contractType, conttitle AS title, buyrno AS endUser, contamt AS contractAmount, net_profit AS profit, userno AS employee, freemaintsdate AS startOfFreeMaintenance, freemaintedate as endOfFreeMaintenance, paymaintSdate as startOfPaidMaintenance, paymaintEdate as endOfPaidMaintenance, contorddate AS saleDate FROM swc_cont WHERE attrib NOT like 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY regdatetime DESC")
    public List<SimpleContract> getList(String compId);

    @Select("SELECT contno AS no, conttype AS salesType, cntrctmth AS contractType, conttitle AS title, buyrno AS endUser, contamt AS contractAmount, net_profit AS profit, userno AS employee, soppno AS sopp, excontno AS prvCont, " +
            "seconduserno AS employee2, custno AS customer, custmemberno AS cipOfCustomer, contdesc AS detail, buyrmemberno AS cipOfendUser, ptncno AS partner, ptncmemberno AS cipOfPartner, supplyno AS supplier, " +
            "supplymemberno AS cipOfSupplier, supplydate AS supplied, delivdate AS delivered, vatyn AS taxInclude, paymaintsdate AS startOfPaidMaintenance, paymaintedate AS endOfPaidMaintenance, contarea AS area, " +
            "businesstype AS typeOfBusiness, regdatetime AS created, moddatetime AS modified, freemaintsdate AS startOfFreeMaintenance, freemaintedate as endOfFreeMaintenance, contorddate AS saleDate " +
            "FROM swc_cont WHERE contno = #{no} AND attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY regdatetime DESC")
    public Contract getContract(@Param("no") int no, @Param("compId") String compId);

    @Update("UPDATE swc_cont SET attrib = 'XXXXX' WHERE contno = #{no} AND compno = (SELECT compno FROM swcore.swc_company WHERE compid = #{compId})")
    public int removeContract(@Param("no") String no, @Param("compId") String compId);
}

