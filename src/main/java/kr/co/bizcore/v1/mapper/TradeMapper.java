package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.TradeDetail;
import kr.co.bizcore.v1.domain.TradeSummary;

public interface TradeMapper {
    
    @Select("SELECT soppno AS no, " +
            "	regdatetime AS `date`, " +
            "	soppTitle AS title, " +
            "	IFNULL((SELECT SUM(datatotal) FROM swc_soppdata01 WHERE attrib NOT LIKE 'XXX%' AND datatype = 1101 AND soppno = a.soppno),0) AS purchase, " +
            "	IFNULL((SELECT SUM(datatotal) FROM swc_soppdata01 WHERE attrib NOT LIKE 'XXX%' AND datatype = 1102 AND soppno = a.soppno),0) AS sales " +
            "FROM swc_sopp a " +
            "WHERE attrib NOT LIKE 'XXX%' AND soppno IN (SELECT soppno FROM swc_soppdata01 WHERE attrib NOT LIKE 'XXX%' AND datatype IN (1101, 1102)) AND a.compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) " +
            "ORDER BY `date` DESC")
    public List<TradeSummary> getTradeList(String compId);

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
    public List<TradeDetail> getTradeDetailList(@Param("sopp") String sopp);

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
    public TradeDetail getTradeDetail(@Param("no") String no);

    @Update("UPDATE swc_soppdata01 SET attrib='XXXXX' WHERE soppdatano=#{no}")
    public int removeTradeDetail(@Param("no") String no);
}
