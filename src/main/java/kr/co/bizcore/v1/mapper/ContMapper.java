package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.Cont;
import kr.co.bizcore.v1.domain.ContFileData;
import kr.co.bizcore.v1.domain.Inout;

public interface ContMapper {
    @Select("SELECT *, swc_sopp.maintenanceTarget FROM swc_cont left join swc_sopp on swc_sopp.soppNo = swc_cont.soppNo WHERE swc_cont.attrib NOT LIKE 'XXX%' AND swc_cont.compNo = #{cont.compNo} ORDER BY swc_cont.regDatetime DESC")
    public List<Cont> getContList(@Param("cont") Cont cont);

    @Select("SELECT * FROM swc_cont WHERE attrib NOT LIKE 'XXX%' AND contNo = #{contNo} AND compNo = #{compNo}")
    public Cont getCont(@Param("contNo") String contNo, @Param("compNo") int compNo);

    @Insert("INSERT INTO swc_cont (compNo, soppNo, cntrctMth, contType, exContNo, userNo, contSecondUserNo, custNo, custMemberNo, contTitle, contDesc, buyrNo, buyrMemberNo, contOrddate, delivDate, contAmt, vatYn, net_profit, freemaintSdate, freemaintEdate, paymaintSdate, paymaintEdate, regDatetime, attrib, categories) VALUES (#{cont.compNo}, #{cont.soppNo}, #{cont.cntrctMth}, #{cont.contType}, #{cont.exContNo}, #{cont.userNo}, #{cont.contSecondUserNo}, #{cont.custNo}, #{cont.custMemberNo}, #{cont.contTitle}, #{cont.contDesc}, #{cont.buyrNo}, #{cont.buyrMemberNo}, #{cont.contOrddate}, #{cont.delivDate}, #{cont.contAmt}, #{cont.vatYn}, #{cont.net_profit}, #{cont.freemaintSdate}, #{cont.freemaintEdate}, #{cont.paymaintSdate}, #{cont.paymaintEdate}, now(), 100000, #{cont.categories})")
    public int contInsert(@Param("cont") Cont cont);

    @Update("UPDATE swc_cont SET attrib = 'XXXXX' WHERE contNo = #{contNo} AND compNo = #{compNo}")
    public int contDelete(@Param("compNo") int compNo, @Param("contNo") String contNo);

    @Update("UPDATE swc_cont SET soppNo = #{cont.soppNo}, cntrctMth = #{cont.cntrctMth}, contType = #{cont.contType}, exContNo = #{cont.exContNo}, contSecondUserNo = #{cont.contSecondUserNo}, custNo = #{cont.custNo}, custMemberNo = #{cont.custMemberNo}, contTitle = #{cont.contTitle}, contDesc = #{cont.contDesc}, buyrNo = #{cont.buyrNo}, buyrMemberNo = #{cont.buyrMemberNo}, contOrddate = #{cont.contOrddate}, delivDate = #{cont.delivDate}, contAmt = #{cont.contAmt}, vatYn = #{cont.vatYn}, net_profit = #{cont.net_profit}, freemaintSdate = #{cont.freemaintSdate}, freemaintEdate = #{cont.freemaintEdate}, paymaintSdate = #{cont.paymaintSdate}, paymaintEdate = #{cont.paymaintEdate}, modDatetime = now(), categories = #{cont.categories} WHERE contNo = #{cont.contNo} AND compNo = #{cont.compNo}")
    public int updateCont(@Param("cont") Cont cont);

    @Select("SELECT * FROM swc_soppdata01 WHERE attrib NOT LIKE 'XXX%' AND contNo = #{inout.contNo} ORDER BY regDatetime DESC")
    public List<Inout> getContInoutList(@Param("inout") Inout inout);

    @Insert("INSERT INTO swc_soppdata01 (soppNo, userNo, catNo, productNo, salesCustNo, dataTitle, dataType, dataQuanty, dataAmt, dataNetprice, dataVat, dataTotal, dataRemark, vatDate, regDatetime, attrib, contNo) VALUES (#{inout.soppNo}, #{inout.userNo}, #{inout.catNo}, #{inout.productNo}, #{inout.salesCustNo}, #{inout.dataTitle}, #{inout.dataType}, #{inout.dataQuanty}, #{inout.dataAmt}, #{inout.dataNetprice}, #{inout.dataVat}, #{inout.dataTotal}, #{inout.dataRemark}, #{inout.vatDate}, now(), 10000, #{inout.contNo})")
    public int contInoutSingleInsert(@Param("inout") Inout inout);

    @Update("UPDATE swc_soppdata01 SET attrib = 'XXXXX' WHERE soppdataNo = #{soppdataNo}")
    public int contInoutCheckDelete(@Param("soppdataNo") String soppdataNo);

    @Insert("INSERT INTO swc_soppdata01 (soppNo, userNo, catNo, productNo, salesCustNo, dataTitle, dataType, dataQuanty, dataAmt, dataNetprice, dataVat, dataTotal, dataRemark, vatDate, endvataDate, regDatetime, attrib, contNo) VALUES (#{inout.soppNo}, #{inout.userNo}, #{inout.catNo}, #{inout.productNo}, #{inout.salesCustNo}, #{inout.dataTitle}, #{inout.dataType}, #{inout.dataQuanty}, #{inout.dataAmt}, #{inout.dataNetprice}, #{inout.dataVat}, #{inout.dataTotal}, #{inout.dataRemark}, #{inout.vatDate}, DATE_SUB(DATE_ADD(#{inout.vatDate}, interval #{inout.divisionMonth} MONTH), interval 1 day), now(), 10000, #{inout.contNo})")
    public int contInoutDivisionInsert(@Param("inout") Inout inout);

    @Update("UPDATE swc_soppdata01 SET userNo = #{inout.userNo}, productNo = #{inout.productNo}, salesCustNo = #{inout.salesCustNo}, dataTitle = #{inout.dataTitle}, dataType = #{inout.dataType}, dataQuanty = #{inout.dataQuanty}, dataAmt = #{inout.dataAmt}, dataNetprice = #{inout.dataNetprice}, dataVat = #{inout.dataVat}, dataTotal = #{inout.dataTotal}, vatDate = #{inout.vatDate}, dataRemark = #{inout.dataRemark} WHERE soppdataNo = #{inout.soppdataNo}")
    public int contInoutUpdate(@Param("inout") Inout inout);

    @Select("SELECT * FROM swc_contfiledata WHERE attrib NOT LIKE 'XXX%' AND contNo = #{contFileData.contNo} ORDER BY regDatetime DESC")
    public List<ContFileData> getContFileList(@Param("contFileData") ContFileData contFileData);

    @Insert("INSERT INTO swc_contfiledata (fileId, fileName, fileDesc, uploadDate, fileContent, fileSize, fileExtention, contNo, userNo, regDatetime, attrib) VALUES (#{contFileData.fileId}, #{contFileData.fileName}, #{contFileData.fileDesc}, now(), #{contFileData.fileContent}, #{contFileData.fileSize}, #{contFileData.fileExtention}, #{contFileData.contNo}, #{contFileData.userNo}, now(), '10000')")
    public int contFileInsert(@Param("contFileData") ContFileData contFileData);

    @Select("SELECT * FROM swc_contfiledata WHERE fileId = #{contFileData.fileId} AND contNo = #{contFileData.contNo}")
    public ContFileData downloadFile(@Param("contFileData") ContFileData contFileData);

    @Update("UPDATE swc_contfiledata SET attrib = 'XXXXX' WHERE fileId = #{fileId}")
    public int contFileDelete(@Param("fileId") String fileId);

    @Select("SELECT concat(year(regDatetime), '-', MONTH(regDatetime)) as calDateMonth, sum(contAmt) as calAmtTotal from swc_cont WHERE compNo = #{cont.compNo} and year(regDatetime) = #{getYear} AND attrib not like 'XXX%' group by calDateMonth")
    public List<Cont> calMonthTotal(@Param("cont") Cont cont, @Param("getYear") int getYear);
    
    @Select("SELECT contType, count(*) as getCount from swc_cont WHERE compNo = 100002 AND attrib not like 'XXX%' AND contType is not NULL group by contType")
    public List<Cont> calContTypeTotal(@Param("cont") Cont cont, @Param("getYear") int getYear);

    @Select("SELECT concat(year(regDatetime), '-', MONTH(regDatetime)) as calDateMonth, sum(contAmt) as calAmtTotal from swc_cont WHERE compNo = #{cont.compNo} and year(regDatetime) = #{getYear} and cntrctMth = 10248 AND attrib not like 'XXX%' group by calDateMonth")
    public List<Cont> calContractTypeTotal(@Param("cont") Cont cont, @Param("getYear") int getYear);

    @Insert("INSERT INTO swc_cont (compNo, soppNo, cntrctMth, contType, exContNo, userNo, custNo, custMemberNo, contTitle, buyrNo, buyrMemberNo, ptncNo, supplyNo, contAmt, vatYn, net_profit, regDatetime, modDatetime, paymaintSdate, paymaintEdate, attrib) SELECT compNo, soppNo, cntrctMth, soppType, 0, userNo, custNo, 0, #{cont.contTitle}, buyrNo, buyrMemberNo, ptncNo, 0, soppTargetAmt, 'N', #{cont.net_profit}, now(), now(), #{maintenance_S}, #{maintenance_E}, '100000' FROM swc_sopp WHERE soppNo = #{cont.soppNo} AND compNo = #{cont.compNo}")
    public int soppCopyContInsert(@Param("cont") Cont cont, @Param("maintenance_S") String maintenance_S, @Param("maintenance_E") String maintenance_E);
}


