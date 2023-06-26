package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.Tech;

public interface TechMapper {
    // @Select("SELECT salesno AS no, salestitle AS title, salesfrdatetime AS \"from\", salestodatetime AS \"to\", soppno AS sopp, userno AS user, custno AS customer, ptncno AS endUser, regdatetime AS created, moddatetime AS modified, " +
    //         "salesdesc AS detail, salesplace AS place, salestype AS type, salescheck AS chk, schedType " +
    //         "FROM swc_sales WHERE attrib NOT LIKE 'XXX%' AND salesno = #{no} AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY created DESC")
    // public Sales getSales(@Param("salesNo") String salesNo, @Param("compNo") int compNo);
    @Select("SELECT * FROM swc_techd WHERE attrib NOT LIKE 'XXX%' AND techdNo = #{techdNo} AND compNo = #{compNo}")
    public Tech getTech(@Param("techdNo") String techdNo, @Param("compNo") int compNo);

//     @Select("SELECT salesno AS no, salestitle AS title, salesfrdatetime AS \"from\", salestodatetime AS \"to\", soppno AS sopp, userno AS user, custno AS customer, ptncno AS endUser, regdatetime AS created, moddatetime AS modified " +
//             "FROM swc_sales WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY created DESC")
//     public List<Sales> getSalesList(String compId);

    @Select("SELECT * FROM swc_techd WHERE attrib NOT LIKE 'XXX%' AND compNo = #{tech.compNo} and regDatetime between #{tech.fromDate} and #{tech.toDate} ORDER BY regDatetime DESC")
    public List<Tech> getTechList(@Param("tech") Tech tech);

    @Insert("INSERT INTO swc_techd (compNo, custNo, soppNo, contNo, cntrctMth, endCustNo, custmemberNo, techdTitle, techdDesc, techdItemmodel, techdItemversion, techdPlace, techdFrom, techdTo, techdType, techdSteps, userNo, regDatetime) VALUES (#{tech.compNo}, #{tech.endCustNo}, #{tech.soppNo}, #{tech.contNo}, #{tech.cntrctMth}, #{tech.endCustNo}, #{tech.custmemberNo}, #{tech.techdTitle}, #{tech.techdDesc}, #{tech.techdItemmodel}, #{tech.techdItemversion}, #{tech.techdPlace}, #{tech.techdFrom}, #{tech.techdTo}, #{tech.techdType}, #{tech.techdSteps}, #{tech.userNo}, now())")
    public int techInsert(@Param("tech") Tech tech);

    @Update("UPDATE swc_techd SET attrib = 'XXXXX' WHERE techdNo = #{techdNo} AND compNo = #{compNo}")
    public int deleteTech(@Param("compNo") int compNo, @Param("techdNo") String techdNo);

    @Update("UPDATE swc_techd SET custNo = #{tech.endCustNo}, soppNo = #{tech.soppNo}, contNo = #{tech.contNo}, cntrctMth = #{tech.cntrctMth}, endCustNo = #{tech.endCustNo}, custmemberNo = #{tech.custmemberNo}, techdTitle = #{tech.techdTitle}, techdDesc = #{tech.techdDesc}, techdItemmodel = #{tech.techdItemmodel}, techdItemversion = #{tech.techdItemversion}, techdPlace = #{tech.techdPlace}, techdFrom = #{tech.techdFrom}, techdTo = #{tech.techdTo}, techdType = #{tech.techdType}, techdSteps = #{tech.techdSteps}, userNo = #{tech.userNo}, modDatetime = now() WHERE techdNo = #{tech.techdNo} AND compNo = #{tech.compNo}")
    public int updateTech(@Param("tech") Tech tech);
}
