package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.Sales;

public interface SalesMapper {
    
    // @Select("SELECT salesno AS no, salestitle AS title, salesfrdatetime AS \"from\", salestodatetime AS \"to\", soppno AS sopp, userno AS user, custno AS customer, ptncno AS endUser, regdatetime AS created, moddatetime AS modified, " +
    //         "salesdesc AS detail, salesplace AS place, salestype AS type, salescheck AS chk, schedType " +
    //         "FROM swc_sales WHERE attrib NOT LIKE 'XXX%' AND salesno = #{no} AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY created DESC")
    // public Sales getSales(@Param("salesNo") String salesNo, @Param("compNo") int compNo);
    @Select("SELECT * FROM swc_sales WHERE attrib NOT LIKE 'XXX%' AND salesNo = #{salesNo} AND compNo = #{compNo}")
    public Sales getSales(@Param("salesNo") String salesNo, @Param("compNo") int compNo);

//     @Select("SELECT salesno AS no, salestitle AS title, salesfrdatetime AS \"from\", salestodatetime AS \"to\", soppno AS sopp, userno AS user, custno AS customer, ptncno AS endUser, regdatetime AS created, moddatetime AS modified " +
//             "FROM swc_sales WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY created DESC")
//     public List<Sales> getSalesList(String compId);

    @Select("SELECT * FROM swc_sales WHERE attrib NOT LIKE 'XXX%' AND compNo = #{sales.compNo} and regDatetime between #{sales.fromDate} and #{sales.toDate} ORDER BY regDatetime DESC")
    public List<Sales> getSalesList(@Param("sales") Sales sales);

    @Insert("INSERT INTO swc_sales (soppNo, userNo, compNo, custNo, salesFrdatetime, salesTodatetime, salesPlace, salesType, salesDesc, salesTitle, ptncNo, regDatetime) VALUES (#{sales.soppNo}, #{sales.userNo}, #{sales.compNo}, #{sales.custNo}, #{sales.salesFrdatetime}, #{sales.salesTodatetime}, #{sales.salesPlace}, #{sales.salesType}, #{sales.salesDesc}, #{sales.salesTitle}, #{sales.ptncNo}, #{sales.regDatetime})")
    public int salesInsert(@Param("sales") Sales sales);

    @Update("UPDATE swc_sales SET attrib = 'XXXXX' WHERE salesno = #{no} AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId})")
    public int removeSales(@Param("no") String no, @Param("compId") String compId);
}
