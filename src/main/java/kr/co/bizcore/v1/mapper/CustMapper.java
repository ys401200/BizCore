package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.Cust;
import kr.co.bizcore.v1.domain.CustData01;
import kr.co.bizcore.v1.domain.CustData02;
import kr.co.bizcore.v1.domain.CustData03;
import kr.co.bizcore.v1.domain.Sales;
import kr.co.bizcore.v1.domain.Tech;

public interface CustMapper {
    @Select("SELECT * FROM swc_cust WHERE compNo = #{cust.compNo}")
    public List<Cust> getCustList(@Param("cust") Cust cust);

    @Select("SELECT * FROM swc_cust WHERE attrib NOT LIKE 'XXX%' AND custNo = #{custNo} AND compNo = #{compNo}")
    public Cust getCust(@Param("custNo") String custNo, @Param("compNo") int compNo);

    @Insert("INSERT INTO swc_cust (compNo, custName, custVatno, custEmail, custVatemail, custBossname, regDatetime) VALUES (#{cust.compNo}, #{cust.custName}, #{cust.custVatno}, #{cust.custEmail}, #{cust.custVatemail}, #{cust.custBossname}, now())")
    public int custInsert(@Param("cust") Cust cust);

    @Select("SELECT * FROM swc_custdata WHERE attrib NOT LIKE 'XXX%' AND custNo = #{custNo} AND compNo = #{compNo}")
    public CustData01 getCustDataList01(@Param("custNo") String custNo, @Param("compNo") int compNo);

    @Select("SELECT * FROM swc_custdata02 WHERE attrib NOT LIKE 'XXX%' AND custNo = #{custNo}")
    public CustData02 getCustDataList02(@Param("custNo") String custNo, @Param("compNo") int compNo);

    @Select("SELECT * FROM swc_custdata03 WHERE attrib NOT LIKE 'XXX%' AND custNo = #{custNo}")
    public CustData03 getCustDataList03(@Param("custNo") String custNo);

    @Select("SELECT * FROM swc_sales WHERE attrib NOT LIKE 'XXX%' AND custNo = #{sales.custNo} AND compNo = #{sales.compNo}")
    public List<Sales> getCustSales(@Param("sales") Sales sales);

    @Select("SELECT * FROM swc_techd WHERE attrib NOT LIKE 'XXX%' AND custNo = #{tech.custNo} AND compNo = #{tech.compNo}")
    public List<Tech> getCustTech(@Param("tech") Tech tech);

}
