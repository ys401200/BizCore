package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.Contract;
import kr.co.bizcore.v1.domain.Maintenance;
import kr.co.bizcore.v1.domain.SimpleContract;

public interface ContractMapper {

    // 계약 전부
    // @Select("SELECT contno AS no, conttype AS salesType, cntrctmth AS
    // contractType, conttitle AS title, soppno AS sopp, buyrno AS endUser, custno
    // AS partner, contamt AS contractAmount, net_profit AS profit, userno AS
    // employee, freemaintsdate AS startOfFreeMaintenance, freemaintedate as
    // endOfFreeMaintenance, paymaintSdate as startOfPaidMaintenance, paymaintEdate
    // as endOfPaidMaintenance, contorddate AS saleDate, regdatetime AS created,
    // moddatetime AS modified FROM swc_cont WHERE attrib NOT like 'XXX%' AND compno
    // = (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY
    // regdatetime DESC")
    // public List<SimpleContract> getList(String compId);

    // 계약 일부
    @Select("SELECT contno AS no, conttype AS salesType, cntrctmth AS contractType, conttitle AS title, soppno AS sopp, buyrno AS endUser, custno AS partner, contamt AS contractAmount, net_profit AS profit, userno AS employee, freemaintsdate AS startOfFreeMaintenance, freemaintedate as endOfFreeMaintenance, paymaintSdate as startOfPaidMaintenance, paymaintEdate as endOfPaidMaintenance, contorddate AS saleDate, regdatetime AS created, moddatetime AS modified FROM swc_cont WHERE attrib NOT like 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY regdatetime DESC LIMIT #{start},#{end}")
    public List<SimpleContract> getListWithStartAndEnd(@Param("compId") String compId, @Param("start") int start,
            @Param("end") int end);

    @Select("SELECT count(*) AS ct FROM swc_cont WHERE attrib NOT like 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY regdatetime DESC")
    public int getCount(String compId);

    // @Select("SELECT contno AS no, conttype AS salesType, cntrctmth AS
    // contractType, conttitle AS title, soppno AS sopp, buyrno AS endUser, custno
    // AS partner, contamt AS contractAmount, net_profit AS profit, userno AS
    // employee, soppno AS sopp, excontno AS prvCont, " +
    // "seconduserno AS employee2, custno AS customer, custmemberno AS
    // cipOfCustomer, contdesc AS detail, buyrmemberno AS cipOfendUser, ptncno AS
    // partner, ptncmemberno AS cipOfPartner, supplyno AS supplier, " +
    // "supplymemberno AS cipOfSupplier, supplydate AS supplied, delivdate AS
    // delivered, vatyn AS taxInclude, paymaintsdate AS startOfPaidMaintenance,
    // paymaintedate AS endOfPaidMaintenance, contarea AS area, " +
    // "businesstype AS typeOfBusiness, regdatetime AS created, moddatetime AS
    // modified, freemaintsdate AS startOfFreeMaintenance, freemaintedate as
    // endOfFreeMaintenance, contorddate AS saleDate " +
    // "FROM swc_cont WHERE contno = #{no} AND attrib NOT LIKE 'XXX%' AND compno =
    // (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY
    // regdatetime DESC")
    // public Contract getContract(@Param("no") int no, @Param("compId") String
    // compId);

    // @Update("UPDATE swc_cont SET attrib = 'XXXXX' WHERE contno = #{no} AND compno
    // = (SELECT compno FROM swcore.swc_company WHERE compid = #{compId})")
    // public int removeContract(@Param("no") String no, @Param("compId") String
    // compId);

    // 계약 삭제
    @Update("UPDATE bizcore.contract SET deleted = now() WHERE no = #{no} AND compId =#{compId}")
    public int removeContract(@Param("no") String no, @Param("compId") String compId);

    // 계약 테이블
    @Select("SELECT  no, title, endUser, contractAmount, profit, employee, saleDate, created, endUser, related from bizcore.contract WHERE compId = #{compId} AND deleted is null ORDER BY created DESC")
    public List<SimpleContract> getList(@Param("compId") String compId);

    // 계약 데이터 상세
    @Select("SELECT no, employee , coworker, customer, cipOfCustomer, title, detail, endUser, cipOfendUser, partner, cipOfPartner, supplier, cipOfsupplier, saleDate, supplied, delivered, contractAmount, taxInclude, profit, created, modified, deleted, related  from bizcore.contract WHERE  compId =#{compId} and no = #{no}")
    public Contract getContract(@Param("no") int no, @Param("compId") String compId);

    // 계약 유지보수 데이터
    @Select("SELECT no, customer, product, contract, startDate,endDate, engineer, coworker, created, modified, deleted, related from bizcore.maintenance WHERE contract = #{contract} and compId = #{compId}")
    public List<Maintenance> getMaintenance(@Param("contract") int no, @Param("compId") String compId);

    @Select("SELECT no, compId, employee, coWorker, customer, cipOfCustomer, title, detail, endUser, cipOfendUser,  partner,  cipOfPartner,  supplier,  cipOfSupplier,  saleDate, supplied, delivered, contractAmount, taxInclude, profit,created, modified, deleted, related FROM bizcore.contract WHERE compId = #{compId}")
    public List<Contract> getFullContract(@Param("compId") String compId);

}
