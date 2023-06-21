package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.Cont;
import kr.co.bizcore.v1.domain.Contract2;
import kr.co.bizcore.v1.domain.Maintenance;
import kr.co.bizcore.v1.domain.SimpleContract;

public interface ContractMapper {

  

    // 계약 일부
    @Select("SELECT contno AS no, conttype AS salesType, cntrctmth AS contractType, conttitle AS title, soppno AS sopp, buyrno AS endUser, custno AS partner, contamt AS contractAmount, net_profit AS profit, userno AS employee, freemaintsdate AS startOfFreeMaintenance, freemaintedate as endOfFreeMaintenance, paymaintSdate as startOfPaidMaintenance, paymaintEdate as endOfPaidMaintenance, contorddate AS saleDate, regdatetime AS created, moddatetime AS modified FROM swc_cont WHERE attrib NOT like 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY regdatetime DESC LIMIT #{start},#{end}")
    public List<SimpleContract> getListWithStartAndEnd(@Param("compId") String compId, @Param("start") int start,
            @Param("end") int end);

    @Select("SELECT count(*) AS ct FROM swc_cont WHERE attrib NOT like 'XXX%' AND compno = #{compNo}")
    public int getCount(int compNo);

    // 계약 삭제
    @Update("UPDATE bizcore.contract SET deleted = now() WHERE no = #{no} AND compId =#{compId}")
    public int removeContract(@Param("no") String no, @Param("compId") String compId);

   
    @Select("SELECT * from swc_cont WHERE compNo = #{compNo} AND attrib not like 'XXX%' ORDER BY regDatetime DESC")
    public List<Cont> getList(@Param("compNo") int compNo);

    // 계약 데이터 상세
    @Select("SELECT no, employee , coworker, customer, title, detail, saleDate, supplied, approved, amount, taxInclude, profit, created, modified, deleted, related  from bizcore.contract WHERE deleted IS NULL AND compId = #{compId} AND no = #{no}")
    public Contract2 getContract(@Param("no") int no, @Param("compId") String compId);

    // 계약 데이터 상세 // + parent
    @Select("SELECT MAX(no) FROM bizcore.contract WHERE deleted IS NULL AND compId = #{compId} AND json_value(related, '$.parent') = #{parent}")
    public Integer getContractNoWithParent(@Param("parent") String parent, @Param("compId") String compId);

    // 계약 유지보수 데이터
    @Select("SELECT no, customer, title, amount, product, contract, startDate, endDate, engineer, coworker, created, modified, deleted, related from bizcore.maintenance WHERE contract = #{contract} and compId = #{compId}")
    public List<Maintenance> getMaintenance(@Param("contract") int no, @Param("compId") String compId);

    @Select("SELECT no, compId, employee, coWorker, customer,title, detail, saleDate, supplied, approved, amount, taxInclude, profit,created, modified, deleted, related FROM bizcore.contract WHERE compId = #{compId}")
    public List<Contract2> getFullContract(@Param("compId") String compId);

    @Insert("Insert bizcore.contract(no,compId, employee, customer, title, amount, related )  values (#{no},#{compId },#{employee},#{customer},#{title},#{amount},#{related})")
    public int insertContract(@Param("no") int no, @Param("compId") String compId,
            @Param("employee") int employee, @Param("customer") int customer, @Param("title") String title,
            @Param("amount") int amount, @Param("related") String related);




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

     // 계약 테이블
    // @Select("SELECT no, title, amount, profit, employee, saleDate, created,
    // related from bizcore.contract WHERE compId = #{compId} AND deleted is null
    // ORDER BY created DESC")
    //@Select("SELECT no, compId, employee, coWorker, customer, title, detail, saleDate, supplied, approved, amount, taxInclude, profit,created, modified, deleted, related from bizcore.contract WHERE deleted IS NULL AND compId = #{compId} AND ORDER BY created DESC")

}