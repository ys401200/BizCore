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

    @Insert("INSERT INTO swc_sales (soppNo, userNo, compNo, custNo, schedFrom, schedTo, salesPlace, `type`, `desc`, `title`, ptncNo, regDatetime) VALUES (#{sales.soppNo}, #{sales.userNo}, #{sales.compNo}, #{sales.custNo}, #{sales.schedFrom}, #{sales.schedTo}, #{sales.salesPlace}, #{sales.type}, #{sales.desc}, #{sales.title}, #{sales.ptncNo}, now())")
    public int salesInsert(@Param("sales") Sales sales);

    @Update("UPDATE swc_sales SET attrib = 'XXXXX' WHERE salesNo = #{salesNo} AND compNo = #{compNo}")
    public int salesDelete(@Param("compNo") int compNo, @Param("salesNo") String salesNo);

    @Update("UPDATE swc_sales SET soppNo = #{sales.soppNo}, userNo = #{sales.userNo}, custNo = #{sales.custNo}, schedFrom = #{sales.schedFrom}, schedTo = #{sales.schedTo}, salesPlace = #{sales.salesPlace}, `type` = #{sales.type}, `desc` = #{sales.desc}, `title` = #{sales.title}, ptncNo = #{sales.ptncNo}, modDatetime = now() WHERE salesNo = #{sales.salesNo} AND compNo = #{sales.compNo}")
    public int updateSales(@Param("sales") Sales sales);
}
