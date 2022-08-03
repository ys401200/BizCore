package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.Sales;
import kr.co.bizcore.v1.domain.SimpleSales;

public interface SalesMapper {
    
    @Select("SELECT salesno AS no, salestitle AS title, salesfrdatetime AS \"from\", salestodatetime AS \"to\", soppno AS sopp, userno AS user, custno AS customer, ptncno AS endUser, regdatetime AS created, moddatetime AS modified, " +
            "salesdesc AS detail, salesplace AS place, salestype AS type, salescheck AS chk, schedType " +
            "FROM swc_sales WHERE attrib NOT LIKE 'XXX%' AND salesno = #{no} AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY created DESC")
    public Sales getSales(@Param("no") String no, @Param("compId") String compId);

    @Select("SELECT salesno AS no, salestitle AS title, salesfrdatetime AS \"from\", salestodatetime AS \"to\", soppno AS sopp, userno AS user, custno AS customer, ptncno AS endUser, regdatetime AS created, moddatetime AS modified " +
            "FROM swc_sales WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY created DESC")
    public List<SimpleSales> getSalesList(String compId);

    @Insert("INSERT INTO swc_sales( " +
            "	salesno,  " +
            "	salestitle,  " +
            "	salesfrdatetime,  " +
            "	salestodatetime,  " +
            "	soppno,  " +
            "	userno,  " +
            "	custno,  " +
            "	ptncno,  " +
            "	regdatetime, " +
            "	salesdesc,  " +
            "	salesplace,  " +
            "	salestype,  " +
            "	salescheck,  " +
            "	schedType, " +
            "	attrib, " +
            "	compno " +
            ") VALUES( " +
            "	#{e.no},  " +
            "	#{e.title},  " +
            "	#{e.from},  " +
            "	#{e.to},  " +
            "	#{e.sopp},  " +
            "	#{e.user},  " +
            "	#{e.customer},  " +
            "	#{e.endUser},  " +
            "	NOW(), " +
            "	#{e.detail},  " +
            "	#{e.place},  " +
            "	#{e.type},  " +
            "	#{e.chk},  " +
            "	10165, " +
            "	10000, " +
            "	(SELECT compno FROM swc_company WHERE compid = #{compId}))")
    public int addSales(@Param("e") Sales e, @Param("compId") String compId);

    @Update("UPDATE swc_sales SET " +
            "	salestitle = #{e.title}, " + 
            "	salesfrdatetime = #{e.from}, " + 
            "	salestodatetime = #{e.to}, " + 
            "	soppno = #{e.sopp}, " + 
            "	userno = #{e.user}, " + 
            "	custno = #{e.customer}, " + 
            "	ptncno = #{e.endUser}, " + 
            "	moddatetime = NOW(), " +
            "	salesdesc = #{e.detail}, " + 
            "	salesplace = #{e.place}, " + 
            "	salestype = #{e.type}, " + 
            "	salescheck = #{e.chk} " +
            "WHERE salesno = #{no} AND compno = (SELECT compno FROM swcore.swc_company WHERE compid = #{compId}) ORDER BY created DESC")
    public int modifySales(@Param("no") String no, @Param("e") Sales e, @Param("compId") String compId);

    @Update("UPDATE swc_sales SET attrib = 'XXXXX' WHERE salesno = #{no} AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId})")
    public int removeSales(@Param("no") String no, @Param("compId") String compId);
}
