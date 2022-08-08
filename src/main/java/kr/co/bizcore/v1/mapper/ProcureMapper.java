package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.Procure;

public interface ProcureMapper {

    @Select("SELECT ppsid AS no, buyerCode, buyerName, buyerArea, buyerAreaCode, reqno AS requestNo, reqitemcode AS requestItemCode, reqItem AS requestItem, itemnetprice AS itemNetPrice, itemQty, " +
            "itemUnit, itemAmount, contracttitle AS title, modQty, modAmount, contractDate, deliveryDate, deliveryPlace, soppno AS sopp, regdate AS created, moddate AS modified " +
            "FROM swc_pps WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY contractdate DESC")
    public List<Procure> getList(String compId);

    @Select("SELECT ppsid AS no, buyerCode, buyerName, buyerArea, buyerAreaCode, reqno AS requestNo, reqitemcode AS requestItemCode, reqItem AS requestItem, itemnetprice AS itemNetPrice, itemQty, " +
            "itemUnit, itemAmount, contracttitle AS title, modQty, modAmount, contractDate, deliveryDate, deliveryPlace, soppno AS sopp, regdate AS created, moddate AS modified " +
            "FROM swc_pps WHERE ppsid = #{no} AND attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY contractdate DESC")
    public Procure getProcure(@Param("no")String no, @Param("compId") String compId);

    @Update("UPDATE swc_pps SET attrib = 'XXXXX' WHERE ppsid = #{ppsid} AND compno = (SELECT compno FROM swcore.swc_company WHERE compid = #{compId})")
    public int removeProcure(@Param("no") String ppsid, @Param("compId") String compId);
}
