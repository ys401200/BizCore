package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.Cont;

public interface ContMapper {
    @Select("SELECT * FROM swc_cont WHERE attrib NOT LIKE 'XXX%' AND compNo = #{cont.compNo} ORDER BY regDatetime DESC")
    public List<Cont> getContList(@Param("cont") Cont cont);

    @Select("SELECT * FROM swc_cont WHERE attrib NOT LIKE 'XXX%' AND contNo = #{contNo} AND compNo = #{compNo}")
    public Cont getCont(@Param("contNo") String contNo, @Param("compNo") int compNo);

    @Insert("INSERT INTO swc_cont (compNo, soppNo, cntrctMth, contType, exContNo, userNo, contSecondUserNo, custNo, custMemberNo, contTitle, contDesc, buyrNo, buyrMemberNo, contOrddate, delivDate, contAmt, vatYn, net_profit, freemaintSdate, freemaintEdate, paymaintSdate, paymaintEdate, regDatetime, attrib, categories) VALUES (#{cont.compNo}, #{cont.soppNo}, #{cont.cntrctMth}, #{cont.contType}, #{cont.exContNo}, #{cont.userNo}, #{cont.contSecondUserNo}, #{cont.custNo}, #{cont.custMemberNo}, #{cont.contTitle}, #{cont.contDesc}, #{cont.buyrNo}, #{cont.buyrMemberNo}, #{cont.contOrddate}, #{cont.delivDate}, #{cont.contAmt}, #{cont.vatYn}, #{cont.net_profit}, #{cont.freemaintSdate}, #{cont.freemaintEdate}, #{cont.paymaintSdate}, #{cont.paymaintEdate}, now(), 100000, #{cont.categories})")
    public int contInsert(@Param("cont") Cont cont);

    @Update("UPDATE swc_cont SET attrib = 'XXXXX' WHERE contNo = #{contNo} AND compNo = #{compNo}")
    public int contDelete(@Param("compNo") int compNo, @Param("contNo") String contNo);

    @Update("UPDATE swc_cont SET soppNo = #{cont.soppNo}, cntrctMth = #{cont.cntrctMth}, contType = #{cont.contType}, exContNo = #{cont.exContNo}, contSecondUserNo = #{cont.contSecondUserNo}, custNo = #{cont.custNo}, custMemberNo = #{cont.custMemberNo}, contTitle = #{cont.contTitle}, contDesc = #{cont.contDesc}, buyrNo = #{cont.buyrNo}, buyrMemberNo = #{cont.buyrMemberNo}, contOrddate = #{cont.contOrddate}, delivDate = #{cont.delivDate}, contAmt = #{cont.contAmt}, vatYn = #{cont.vatYn}, net_profit = #{cont.net_profit}, freemaintSdate = #{cont.freemaintSdate}, freemaintEdate = #{cont.freemaintEdate}, paymaintSdate = #{cont.paymaintSdate}, paymaintEdate = #{cont.paymaintEdate}, modDatetime = now(), categories = #{cont.categories} WHERE contNo = #{cont.contNo} AND compNo = #{cont.compNo}")
    public int updateCont(@Param("cont") Cont cont);
}
