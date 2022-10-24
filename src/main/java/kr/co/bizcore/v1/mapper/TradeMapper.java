package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.TradeDetail;
import kr.co.bizcore.v1.domain.TradeSummary;

public interface TradeMapper {

    // ↓↓↓↓↓↓↓↓↓↓↓↓ 2022. 10. 23 이전  작업분량↓↓↓↓↓↓↓↓↓↓↓↓
    
    @Select("SELECT soppno AS no, " +
            "	regdatetime AS `date`, " +
            "	soppTitle AS title, " +
            "	IFNULL((SELECT SUM(datatotal) FROM swc_soppdata01 WHERE attrib NOT LIKE 'XXX%' AND datatype = 1101 AND soppno = a.soppno),0) AS purchase, " +
            "	IFNULL((SELECT SUM(datatotal) FROM swc_soppdata01 WHERE attrib NOT LIKE 'XXX%' AND datatype = 1102 AND soppno = a.soppno),0) AS sales " +
            "FROM swc_sopp a " +
            "WHERE attrib NOT LIKE 'XXX%' AND soppno IN (SELECT soppno FROM swc_soppdata01 WHERE attrib NOT LIKE 'XXX%' AND datatype IN (1101, 1102)) AND a.compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) " +
            "ORDER BY `date` DESC")
    public List<TradeSummary> getTradeListXXXXX(String compId);

    @Select("SELECT soppdatano AS no, " +
            "   soppno AS sopp, " +
            "	userno AS writer, " +
            "	catno AS category, " +
            "	productno AS product, " +
            "	salescustno AS customer, " +
            "	vatserial AS vatSerial, " +
            "	datatitle AS title, " +
            "	datadesc AS `desc`, " +
            "	datatype AS `type`, " +
            "	dataquanty AS quantity, " +
            "	dataamt AS amount, " +
            "	datadiscount AS discount, " +
            "	datanetprice AS netPrice, " +
            "	datavat AS tax, " +
            "	datatotal AS total, " +
            "	dataremark AS remark, " +
            "	endvatadate AS endVataDate, " +
            "	regdatetime AS created, " +
            "	moddatetime AS modified " +
            "FROM swc_soppdata01 " +
            "WHERE attrib NOT LIKE 'XXX%' AND soppno = #{sopp}")
    public List<TradeDetail> getTradeDetailListXXXXX(@Param("sopp") String sopp);

    @Select("SELECT soppdatano AS no, " +
            "   soppno AS sopp, " +
            "	userno AS writer, " +
            "	catno AS category, " +
            "	productno AS product, " +
            "	salescustno AS customer, " +
            "	vatserial AS vatSerial, " +
            "	datatitle AS title, " +
            "	datadesc AS `desc`, " +
            "	datatype AS `type`, " +
            "	dataquanty AS quantity, " +
            "	dataamt AS amount, " +
            "	datadiscount AS discount, " +
            "	datanetprice AS netPrice, " +
            "	datavat AS tax, " +
            "	datatotal AS total, " +
            "	dataremark AS remark, " +
            "	endvatadate AS endVataDate, " +
            "	regdatetime AS created, " +
            "	moddatetime AS modified " +
            "FROM swc_soppdata01 " +
            "WHERE attrib NOT LIKE 'XXX%' AND soppdatano = #{no}")
    public TradeDetail getTradeDetailXXXXX(@Param("no") String no);

    @Select("SELECT soppdatano AS no, " +
            "   soppno AS sopp, " +
            "	userno AS writer, " +
            "	catno AS category, " +
            "	productno AS product, " +
            "	salescustno AS customer, " +
            "	vatserial AS vatSerial, " +
            "	datatitle AS title, " +
            "	datadesc AS `desc`, " +
            "	datatype AS `type`, " +
            "	dataquanty AS quantity, " +
            "	dataamt AS amount, " +
            "	datadiscount AS discount, " +
            "	datanetprice AS netPrice, " +
            "	datavat AS tax, " +
            "	datatotal AS total, " +
            "	dataremark AS remark, " +
            "	endvatadate AS endVataDate, " +
            "	regdatetime AS created, " +
            "	moddatetime AS modified " +
            "FROM swc_soppdata01 " +
            "WHERE attrib NOT LIKE 'XXX%' AND soppdatano = (SELECT soppno FROM swc_cont WHERE contno = #{contNo})")
    public List<TradeDetail> getTradeDetailForContractXXXXX(@Param("contNo") int no);

    @Update("UPDATE swc_soppdata01 SET attrib='XXXXX' WHERE soppdatano=#{no}")
    public int removeTradeDetailXXXXX(@Param("no") String no);
}
