package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.Cust;
import kr.co.bizcore.v1.domain.CustData01;
import kr.co.bizcore.v1.domain.CustData02;
import kr.co.bizcore.v1.domain.CustData03;
import kr.co.bizcore.v1.domain.Sales;
import kr.co.bizcore.v1.domain.Tech;

public interface CustMapper {
    @Select("SELECT * FROM swc_cust WHERE (attrib = '10000' OR attrib = 'XXXX1') AND compNo = #{cust.compNo}")
    public List<Cust> getCustList(@Param("cust") Cust cust);

    @Select("SELECT * FROM swc_cust WHERE (attrib = '10000' OR attrib = 'XXXX1') AND custNo = #{custNo} AND compNo = #{compNo}")
    public Cust getCust(@Param("custNo") String custNo, @Param("compNo") int compNo);

    @Insert("INSERT INTO swc_cust (compNo, custName, custVatno, custEmail, custVatemail, custBossname, custYn, buyrYn, ptncYn, suppYn, saleType, compType, regDatetime, attrib) VALUES (#{cust.compNo}, #{cust.custName}, #{cust.custVatno}, #{cust.custEmail}, #{cust.custVatemail}, #{cust.custBossname}, #{cust.custYn}, #{cust.buyrYn}, #{cust.ptncYn}, #{cust.suppYn}, #{cust.saleType}, #{cust.compType}, now(), 'XXXX1')")
    public int custInsert(@Param("cust") Cust cust);

    @Update("UPDATE swc_cust SET compNo = #{cust.compNo}, custName = #{cust.custName}, custVatno = #{cust.custVatno}, custEmail = #{cust.custEmail}, custVatemail = #{cust.custVatemail}, custBossname = #{cust.custBossname}, custYn = #{cust.custYn}, buyrYn = #{cust.buyrYn}, ptncYn = #{cust.ptncYn}, suppYn = #{cust.suppYn}, saleType = #{cust.saleType}, compType = #{cust.compType}, modDatetime = now() WHERE custNo = #{cust.custNo} AND compNo = #{cust.compNo}")
    public int updateCust(@Param("cust") Cust cust);

    @Update("UPDATE swc_cust SET attrib = 'XXXXX' WHERE custNo = #{custNo} AND compNo = #{compNo}")
    public int custDelete(@Param("compNo") int compNo, @Param("custNo") String custNo);

    @Update("UPDATE swc_cust SET attrib = '10000', modDatetime = now() WHERE custNo = #{cust.custNo} AND compNo = #{cust.compNo}")
    public int customerAddChange(@Param("cust") Cust cust);
    
    @Insert("INSERT INTO swc_custdata (custNo, compNo, custVatno, custVatemail, custVattype, custVatbiz, custVatmemo, custByear, custCRbalance, custDRbalance, regDatetime) VALUES (#{custdata01.custNo}, #{custdata01.compNo}, #{custdata01.custVatno}, #{custdata01.custVatemail}, #{custdata01.custVattype}, #{custdata01.custVatbiz}, #{custdata01.custVatmemo}, #{custdata01.custByear}, #{custdata01.custCRbalance}, #{custdata01.custDRbalance}, now())")
    public int insertCustData01(@Param("custdata01") CustData01 custdata01);

    @Update("UPDATE swc_custdata SET custNo = #{custdata01.custNo}, compNo = #{custdata01.compNo}, custVatno = #{custdata01.custVatno}, custVatemail = #{custdata01.custVatemail}, custVattype = #{custdata01.custVattype}, custVatbiz = #{custdata01.custVatbiz}, custVatmemo = #{custdata01.custVatmemo}, custByear = #{custdata01.custByear}, custCRbalance = #{custdata01.custCRbalance}, custDRbalance = #{custdata01.custDRbalance}, modDatetime = now() WHERE custNo = #{custdata01.custNo} AND compNo = #{custdata01.compNo}")
    public int updateCustData01(@Param("custdata01") CustData01 custdata01);

    @Update("UPDATE swc_custdata SET attrib = 'XXXXX' WHERE custNo = #{custNo} AND compNo = #{compNo}")
    public int deleteCustData01(@Param("compNo") int compNo, @Param("custNo") String custNo);

    @Insert("INSERT INTO swc_custdata02 (custNo, custPostno, custAddr, custAddr2, custTel, custFax, custMemo, regDatetime) VALUES (#{custdata02.custNo}, #{custdata02.custPostno}, #{custdata02.custAddr}, #{custdata02.custAddr2}, #{custdata02.custTel}, #{custdata02.custFax}, #{custdata02.custMemo}, now())")
    public int insertCustData02(@Param("custdata02") CustData02 custdata02);

    @Update("UPDATE swc_custdata02 SET custNo = #{custdata02.custNo}, custPostno = #{custdata02.custPostno}, custAddr = #{custdata02.custAddr}, custAddr2 = #{custdata02.custAddr2}, custTel = #{custdata02.custTel}, custFax = #{custdata02.custFax}, custMemo = #{custdata02.custMemo}, modDatetime = now() WHERE custNo = #{custdata02.custNo}")
    public int updateCustData02(@Param("custdata02") CustData02 custdata02);

    @Update("UPDATE swc_custdata02 SET attrib = 'XXXXX' WHERE custNo = #{custNo}")
    public int deleteCustData02(@Param("compNo") int compNo, @Param("custNo") String custNo);

    @Insert("INSERT INTO swc_custdata03 (custNo, compNo, custMname, custMrank, custMmobile, custMtel, custMemail, custMmemo, regDatetime) VALUES (#{custdata03.custNo}, #{custdata03.compNo}, #{custdata03.custMname}, #{custdata03.custMrank}, #{custdata03.custMmobile}, #{custdata03.custMtel}, #{custdata03.custMemail}, #{custdata03.custMmemo}, now())")
    public int insertCustData03(@Param("custdata03") CustData03 custdata03);

    @Update("UPDATE swc_custdata03 SET custNo = #{custdata03.custNo}, compNo = #{custdata03.compNo}, custMname = #{custdata03.custMname}, custMrank = #{custdata03.custMrank}, custMmobile = #{custdata03.custMmobile}, custMtel = #{custdata03.custMtel}, custMemail = #{custdata03.custMemail}, custMmemo = #{custdata03.custMmemo}, modDatetime = now() WHERE custNo = #{custdata03.custNo} AND compNo = #{custdata03.compNo}")
    public int updateCustData03(@Param("custdata03") CustData03 custdata03);

    @Update("UPDATE swc_custdata03 SET attrib = 'XXXXX' WHERE custNo = #{custNo} AND compNo = #{compNo}")
    public int deleteCustData03(@Param("compNo") int compNo, @Param("custNo") String custNo);

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
