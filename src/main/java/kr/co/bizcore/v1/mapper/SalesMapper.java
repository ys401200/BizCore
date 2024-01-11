package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.Sales;
import kr.co.bizcore.v1.domain.SalesTarget;

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

    @Insert("INSERT INTO swc_sales (soppNo, userNo, compNo, custNo, schedFrom, schedTo, salesPlace, schedType, `type`, `desc`, `title`, ptncNo, regDatetime) VALUES (#{sales.soppNo}, #{sales.userNo}, #{sales.compNo}, #{sales.custNo}, #{sales.schedFrom}, #{sales.schedTo}, #{sales.salesPlace}, '10165', #{sales.type}, #{sales.desc}, #{sales.title}, #{sales.ptncNo}, now())")
    public int salesInsert(@Param("sales") Sales sales);

    @Update("UPDATE swc_sales SET attrib = 'XXXXX' WHERE salesNo = #{salesNo} AND compNo = #{compNo}")
    public int salesDelete(@Param("compNo") int compNo, @Param("salesNo") String salesNo);

    @Update("UPDATE swc_sales SET soppNo = #{sales.soppNo}, userNo = #{sales.userNo}, custNo = #{sales.custNo}, schedFrom = #{sales.schedFrom}, schedTo = #{sales.schedTo}, salesPlace = #{sales.salesPlace}, `type` = #{sales.type}, `desc` = #{sales.desc}, `title` = #{sales.title}, ptncNo = #{sales.ptncNo}, modDatetime = now() WHERE salesNo = #{sales.salesNo} AND compNo = #{sales.compNo}")
    public int updateSales(@Param("sales") Sales sales);

    @Select("SELECT swc_user.userNo, swc_user.compNo, swc_sales_target.targetYear, IFNULL(swc_sales_target.mm01, 0) as mm01, IFNULL(swc_sales_target.mm02, 0) as mm02, IFNULL(swc_sales_target.mm03, 0) as mm03, IFNULL(swc_sales_target.mm04, 0) as mm04, IFNULL(swc_sales_target.mm05, 0) as mm05, IFNULL(swc_sales_target.mm06, 0) as mm06, IFNULL(swc_sales_target.mm07, 0) as mm07, IFNULL(swc_sales_target.mm08, 0) as mm08, IFNULL(swc_sales_target.mm09, 0) as mm09, IFNULL(swc_sales_target.mm10, 0) as mm10, IFNULL(swc_sales_target.mm11, 0) as mm11, IFNULL(swc_sales_target.mm12, 0) as mm12, swc_sales_target.targetType, swc_user.attrib FROM swc_user LEFT JOIN swc_sales_target ON swc_sales_target.userNo = swc_user.userNo AND swc_sales_target.targetYear = #{getYear} WHERE swc_user.attrib NOT LIKE 'XXX%' AND swc_user.compNo = #{salesTarget.compNo} GROUP BY swc_user.userNo")
    public List<SalesTarget> getGoalList(@Param("salesTarget") SalesTarget salesTarget, @Param("getYear") int getYear);

    @Insert("INSERT INTO swc_sales_target (compNo, deptNo, userNo, targetYear, mm01, mm02, mm03, mm04, mm05, mm06, mm07, mm08, mm09, mm10, mm11, mm12, targetType, regDatetime) VALUES (#{salesTarget.compNo}, #{salesTarget.deptNo}, #{salesTarget.userNo}, #{salesTarget.targetYear}, #{salesTarget.mm01}, #{salesTarget.mm02}, #{salesTarget.mm03}, #{salesTarget.mm04}, #{salesTarget.mm05}, #{salesTarget.mm06}, #{salesTarget.mm07}, #{salesTarget.mm08}, #{salesTarget.mm09}, #{salesTarget.mm10}, #{salesTarget.mm11}, #{salesTarget.mm12}, #{salesTarget.targetType}, now())")
    public int goalInsert(@Param("salesTarget") SalesTarget salesTarget);

    @Update("UPDATE swc_sales_target SET deptNo = #{salesTarget.deptNo}, userNo = #{salesTarget.userNo}, mm01 = #{salesTarget.mm01}, mm02 = #{salesTarget.mm02}, mm03 = #{salesTarget.mm03}, mm04 = #{salesTarget.mm04}, mm05 = #{salesTarget.mm05}, mm06 = #{salesTarget.mm06}, mm07 = #{salesTarget.mm07}, mm08 = #{salesTarget.mm08}, mm09 = #{salesTarget.mm09}, mm10 = #{salesTarget.mm10}, mm11 = #{salesTarget.mm11}, mm12 = #{salesTarget.mm12}, targetType = #{salesTarget.targetType}, modDatetime = now() WHERE userNo = #{salesTarget.userNo} AND compNo = #{salesTarget.compNo} AND targetYear = #{salesTarget.targetYear}")
    public int goalUpdate(@Param("salesTarget") SalesTarget salesTarget);
}
