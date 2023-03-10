package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.Procure;

public interface ProcureMapper {

    @Select("INSERT INTO bizcore.procure(compid,id,customerCode,customerName,area,`type`,reqNo,itemCode,item,price,qty,unit,amount,title,modQty,modAmount,contractDate,deliveryPlace,created) SELECT 'vtek', ppsid, buyerCode, buyerName, buyerArea, buyerAreacode, reqNo, reqItemcode, reqItem, itemNetprice, itemQty, itemUnit, itemAmount, contractTitle, modQty, modAmount, contractDate, deliveryPlace, regDate FROM swcore.swc_pps WHERE compno = 100002 AND regdate > '2022-11-1' AND ppsid NOT IN (SELECT id FROM bizcore.procure WHERE deleted IS NULL AND compId = 'vtek')")
    public Integer copyProcure();


        // ================================================= 이전 메서드들 ==========================

    @Select("SELECT ppsid AS no, buyerCode, buyerName, buyerArea, buyerAreaCode, reqno AS requestNo, reqitemcode AS requestItemCode, reqItem AS requestItem, itemnetprice AS itemNetPrice, itemQty, " +
            "itemUnit, itemAmount, contracttitle AS title, modQty, modAmount, contractDate, deliveryDate, deliveryPlace, soppno AS sopp, regdate AS created, moddate AS modified " +
            "FROM swc_pps WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY contractdate DESC")
    public List<Procure> getList(String compId);

    @Select("SELECT ppsid AS no, buyerCode, buyerName, buyerArea, buyerAreaCode, reqno AS requestNo, reqitemcode AS requestItemCode, reqItem AS requestItem, itemnetprice AS itemNetPrice, itemQty, " +
            "itemUnit, itemAmount, contracttitle AS title, modQty, modAmount, contractDate, deliveryDate, deliveryPlace, soppno AS sopp, regdate AS created, moddate AS modified " +
            "FROM swc_pps WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY contractdate DESC LIMIT #{start}, #{end}")
    public List<Procure> getListWithStartAndEnd(@Param("compId") String compId, @Param("start") int start, @Param("end") int end);

    @Select("SELECT count(*) FROM swc_pps WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId})")
    public int getCount(@Param("compId") String compId);

    @Select("SELECT ppsid AS no, buyerCode, buyerName, buyerArea, buyerAreaCode, reqno AS requestNo, reqitemcode AS requestItemCode, reqItem AS requestItem, itemnetprice AS itemNetPrice, itemQty, " +
            "itemUnit, itemAmount, contracttitle AS title, modQty, modAmount, contractDate, deliveryDate, deliveryPlace, soppno AS sopp, regdate AS created, moddate AS modified " +
            "FROM swc_pps WHERE ppsid = #{no} AND attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY contractdate DESC")
    public Procure getProcure(@Param("no")String no, @Param("compId") String compId);

    @Update("UPDATE swc_pps SET attrib = 'XXXXX' WHERE ppsid = #{ppsid} AND compno = (SELECT compno FROM swcore.swc_company WHERE compid = #{compId})")
    public int removeProcure(@Param("no") String ppsid, @Param("compId") String compId);
}
