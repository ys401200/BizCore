package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.Contract;
import kr.co.bizcore.v1.domain.SimpleContract;

public interface ContractMapper {
    
    @Select("SELECT contno AS no, conttype AS salesType, cntrctmth AS contractType, conttitle AS title, buyrno AS buyer, contamt AS contractAmount, net_profit AS profit, userno AS employee, freemaintsdate AS freeMaintenanceStart, freemaintedate as freeMaintenanceEnd, contorddate AS saleDate FROM swc_cont WHERE attrib NOT like 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY regdatetime DESC")
    public List<SimpleContract> getContractList(String compId);

    @Select("ELECT contno AS no, conttype AS salesType, cntrctmth AS contractType, conttitle AS title, buyrno AS buyer, contamt AS contractAmount, net_profit AS profit, userno AS employee, soppno AS sopp, excontno AS prvCont, " +
            "seconduserno AS employee2, custno AS customer, custmemberno AS cipOfCustomer, contdesc AS detail, buyrmemberno AS cipOfBuyer, ptncno AS partner, ptncmemberno AS cipOfPartner, supplyno AS supplier, " +
            "supplymemberno AS cipOfSupplier, supplydate AS supplied, delivdate AS delivered, vatyn AS taxInclude, paymaintsdate AS startOfPaidMaintenance, paymaintedate AS endOfPaidMaintenance, contarea AS area, " +
            "businesstype AS typeOfBusiness, regdatetime AS created, moddatetime AS modified, freemaintsdate AS maintenanceStart, freemaintedate as maintenanceEnd, contorddate AS saleDate " +
            "FROM swc_cont WHERE contno = #{no} AND attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY regdatetime DESC")
    public Contract getContract(@Param("no") String no, @Param("compId") String compId);

    @Insert("INSERT INTO swc_cont( " +
            "   conttype, " + 
            "   cntrctmth, " + 
            "   conttitle, " + 
            "   buyrno, " + 
            "   contamt, " + 
            "   net_profit, " + 
            "   userno, " + 
            "   soppno, " + 
            "   excontno, " +
            "   seconduserno, " + 
            "   custno, " + 
            "   custmemberno, " + 
            "   contdesc, " + 
            "   buyrmemberno, " + 
            "   ptncno, " + 
            "   ptncmemberno, " + 
            "   supplyno, " +
            "   supplymemberno, " + 
            "   supplydate, " + 
            "   delivdate, " + 
            "   vatyn, " + 
            "   paymaintsdate, " + 
            "   paymaintedate, " + 
            "   contarea, " +
            "   businesstype, " +
            "   freemaintsdate, " +
            "   freemaintedate, " +
            "   contorddate, " +
            "   regdatetime, " +
            "   attrib, " +
            "   compno" +
            ") VALUES( " +
            "   #{cnt.salesType}, " +
            "   #{cnt.contractType}, " +
            "   #{cnt.title}, " +
            "   #{cnt.buyer}, " +
            "   #{cnt.contractAmount}, " +
            "   #{cnt.profit}, " +
            "   #{cnt.employee}, " + 
            "   #{cnt.sopp}, " +
            "   #{cnt.prvCont}, " +
            "   #{cnt.employee2}, " +
            "   #{cnt.customer}, " +
            "   #{cnt.cipOfCustomer}, " +
            "   #{cnt.detail}, " +
            "   #{cnt.cipOfBuyer}, " +
            "   #{cnt.partner}, " +
            "   #{cnt.cipOfPartner}, " +
            "   #{cnt.supplier}, " +
            "   #{cnt.cipOfSupplier}, " +
            "   #{cnt.supplied}, " +
            "   #{cnt.delivered}, " +
            "   IF(#{cnt.taxInclude},'Y','N'), " +
            "   #{cnt.startOfPaidMaintenance}, " +
            "   #{cnt.endOfPaidMaintenance}, " +
            "   #{cnt.area}, " +
            "   #{cnt.typeOfBusiness}, " +
            "   #{cnt.maintenanceStart}," + 
            "   #{cnt.maintenanceEnd}, " + 
            "   #{cnt.saleDate}, " +
            "   NOW(), " +
            "   10000, " +
            "   (SELECT compno FROM swc_company WHERE compid = #{compId}))")
    public int addContract(@Param("compId") String compId, @Param("cnt") Contract contract);

    @Update("UPDATE swc_cont SET " +
                "       conttype = #{cnt.salesType}, " + 
                "       cntrctmth = #{cnt.contractType}, " +
                "       conttitle = #{cnt.title}, " +
                "       buyrno = #{cnt.buyer}, " +
                "       contamt = #{cnt.contractAmount}, " + 
                "       net_profit = #{cnt.profit}, " +
                "       userno = #{cnt.employee}, " +
                "       soppno = #{cnt.sopp}, " +
                "       excontno = #{cnt.prvCont}, " +
                "       seconduserno = #{cnt.employee2}, " +
                "       custno = #{cnt.customer}, " +
                "       custmemberno = #{cnt.cipOfCustomer}, " +
                "       contdesc = #{cnt.detail}, " +
                "       buyrmemberno = #{cnt.cipOfBuyer}, " +
                "       ptncno = #{cnt.partner}, " +
                "       ptncmemberno = #{cnt.cipOfPartner}, " +
                "       supplyno = #{cnt.supplier}, " +
                "       supplymemberno = #{cnt.cipOfSupplier}, " +
                "       supplydate = #{cnt.supplied}, " +
                "       delivdate =#{cnt. delivered}, " +
                "       vatyn = IF(#{cnt.taxInclude},'Y','N'), " +
                "       paymaintsdate = #{cnt.startOfPaidMaintenance}, " +
                "       paymaintedate = #{cnt.endOfPaidMaintenance}, " +
                "       contarea = #{cnt.area}, " +
                "       businesstype = #{cnt.typeOfBusiness}, " +
                "       moddatetime = NOW(), " +
                "       moddatetime = #{cnt.modified}, " +
                "       freemaintsdate = #{cnt.maintenanceStart}, " +
                "       freemaintedate = #{cnt.maintenanceEnd}, " +
                "       contorddate = #{cnt.saleDate} " +
                "WHERE contno = #{cnt.no} AND attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swcore.swc_company WHERE compid = #{compId})")
    public int modifyContract(@Param("compId") String compId, @Param("cnt") Contract contract);

    @Update("UPDATE swc_cont SET attrib = 'XXXXX' WHERE contno = #{no} AND compno = (SELECT compno FROM swcore.swc_company WHERE compid = #{compId})")
    public int removeContract(@Param("no") String no, @Param("compId") String compId);
}

