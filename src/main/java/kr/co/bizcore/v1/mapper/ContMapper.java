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

    @Select("SELECT * FROM swc_contfiledata WHERE attrib NOT LIKE 'XXX%' AND contNo = #{contFileData.contNo} ORDER BY regDatetime DESC")
    public List<ContFileData> getContFileList(@Param("contFileData") ContFileData contFileData);

    @Insert("INSERT INTO swc_contfiledata (fileId, fileName, fileDesc, uploadDate, fileContent, fileSize, fileExtention, contNo, userNo, regDatetime, attrib) VALUES (#{contFileData.fileId}, #{contFileData.fileName}, #{contFileData.fileDesc}, now(), #{contFileData.fileContent}, #{contFileData.fileSize}, #{contFileData.fileExtention}, #{contFileData.contNo}, #{contFileData.userNo}, now(), '10000')")
    public int contFileInsert(@Param("contFileData") ContFileData contFileData);

    @Select("SELECT * FROM swc_contfiledata WHERE fileId = #{contFileData.fileId} AND contNo = #{contFileData.contNo}")
    public ContFileData downloadFile(@Param("contFileData") ContFileData contFileData);

    @Update("UPDATE swc_contfiledata SET attrib = 'XXXXX' WHERE fileId = #{fileId}")
    public int contFileDelete(@Param("fileId") String fileId);
}
