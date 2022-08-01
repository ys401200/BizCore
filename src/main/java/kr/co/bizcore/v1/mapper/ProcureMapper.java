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
            "FROM swc_pps WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = :compId) ORDER BY contractdate DESC")
    public List<Procure> getList(String compId);

    @Select("SELECT ppsid AS no, buyerCode, buyerName, buyerArea, buyerAreaCode, reqno AS requestNo, reqitemcode AS requestItemCode, reqItem AS requestItem, itemnetprice AS itemNetPrice, itemQty, " +
            "itemUnit, itemAmount, contracttitle AS title, modQty, modAmount, contractDate, deliveryDate, deliveryPlace, soppno AS sopp, regdate AS created, moddate AS modified " +
            "FROM swc_pps WHERE ppsid = #{no} AND attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = :compId) ORDER BY contractdate DESC")
    public Procure getProcure(@Param("no")int no, @Param("compId") String compId);

    @Insert("INSERT INTO swc_pps( " +
            "	buyerCode, " +
            "	buyerName, " +
            "	buyerArea, " +
            "	buyerAreaCode, " +
            "	reqno, " +
            "	reqitemcode, " + 
            "	reqItem, " +
            "	itemnetprice, " +
            "	itemQty, " +
            "	itemUnit, " +
            "	itemAmount, " +
            "	contracttitle, " + 
            "	contractDate, " +
            "	deliveryDate, " +
            "	deliveryPlace, " +
            "	soppno,  " +
            "	regdate, " +
            "	attrib, " +
            "	compno " +
            ") VALUES( " +
            "	#{e.buyerCode}, " +
            "	#{e.buyerName}, " +
            "	#{e.buyerArea}, " +
            "	#{e.buyerAreaCode}, " +
            "	#{e.requestNo}, " +
            "	#{e.requestItemCode}, " +
            "	#{e.requestItem}, " +
            "	#{e.itemNetPrice}, " +
            "	#{e.itemQty}, " +
            "	#{e.itemUnit}, " +
            "	#{e.itemAmount}, " +
            "	#{e.title}, " +
            "	#{e.contractDate}, " +
            "	#{e.deliveryDate}, " +
            "	#{e.deliveryPlace}, " +
            "	#{e.sopp}, " +
            "	NOW()}, " +
            "	10000}, " +
            "	(SELECT compno FROM swc_company WHERE compid = #{compId}))")
    public int addProcure(@Param("e") Procure e, @Param("compId")  String compId);

    @Update("UPDATE swc_pps SET " +
            "	buyerCode = #{e.buyerCode}, " +
            "	buyerName = #{e.buyerCode}, " +
            "	buyerArea = #{e.buyerCode}, " +
            "	buyerAreaCode = #{e.buyerCode}, " + 
            "	reqno = #{e.requestNo}, " +
            "	reqitemcode = #{e.requestItemCode}, " +
            "	reqItem = #{e.requestItem}, " +
            "	itemnetprice = #{e.itemNetPrice}, " + 
            "	itemQty = #{e.itemQty}, " +
            "	itemUnit = #{e.itemUnit}, " +
            "	itemAmount = #{e.itemAmount}, " +
            "	contracttitle = #{e.title}, " + 
            "	modQty = #{e.modQty}, " +
            "	modAmount = #{e.modAmount}, " +
            "	contractDate = #{e.contractDate}, " +
            "	deliveryDate = #{e.deliveryDate}, " +
            "	deliveryPlace = #{e.deliveryPlace}, " + 
            "	soppno = #{e.sopp}, " + 
            "	moddate = NOW()" +
            "WHERE ppsid = #{e.no} AND compno = (SELECT compno FROM swcore.swc_company WHERE compid = #{compId})")
    public int modifyProcure(@Param("e") Procure e, @Param("compId") String compId);

    @Update("UPDATE swc_pps SET attrib = 'XXXXX' WHERE ppsid = #{ppsid} AND compno = (SELECT compno FROM swcore.swc_company WHERE compid = #{compId})")
    public int removeProcure(@Param("no") String ppsid, @Param("compId") String compId);
}
