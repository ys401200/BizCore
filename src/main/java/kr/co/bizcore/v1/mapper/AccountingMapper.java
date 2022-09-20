package kr.co.bizcore.v1.mapper;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.SimpleTaxBill;
import kr.co.bizcore.v1.domain.TaxBill;

public interface AccountingMapper {
    
    @Select("SELECT vatid AS no, vattype AS type, vatissuedate AS issueDate, vattradedate AS tradeDate, vatno AS regNo, vatserial AS sn, vatamount AS amount, vattax AS tax, vatproductname AS product, vatremark AS remark, regdate AS created, modDate AS modified " + 
            "FROM swc_vat WHERE attrib NOT LIKE 'XXX%' AND (#{all} = 1 OR vatstatus NOT IN ('B5', 'S5')) AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY issueDate desc")
    public List<SimpleTaxBill> getSimpleTaxBillList(@Param("compId") String compId, @Param("all") boolean all);

    @Select("SELECT vatid AS no, vattype AS type, vatissuedate AS issueDate, vattradedate AS tradeDate, vatno AS regNo, vatserial AS sn, vatamount AS amount, " +
            "vattax AS tax, vatproductname AS product, vatremark AS remark, regdate AS created, modDate AS modified, RIGHT(vatStatus,1) AS status, " +
            "vatbuyercustno AS buyer, vatsellercustno AS seller, vatemail AS email, vatstandard AS standard, vatissuetype AS issueType " +
            "FROM swc_vat WHERE attrib NOT LIKE 'XXX%' AND vatid = #{no} AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY issueDate desc")
    public TaxBill getTaxBill(@Param("no") String no, @Param("compId") String compId);

    @Select("SELECT vatid AS no, vattype AS type, vatissuedate AS issueDate, vattradedate AS tradeDate, vatno AS regNo, vatserial AS sn, vatamount AS amount, " +
    "vattax AS tax, vatproductname AS product, vatremark AS remark, regdate AS created, modDate AS modified, RIGHT(vatStatus,1) AS status, " +
    "vatbuyercustno AS buyer, vatsellercustno AS seller, vatemail AS email, vatstandard AS standard, vatissuetype AS issueType " +
    "FROM swc_vat WHERE attrib NOT LIKE 'XXX%' AND contno = #{contNo} AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY issueDate desc")
    public List<TaxBill> getTaxBillForContract(@Param("compId") String compId, @Param("contNo") int no);

    // 정해진 기간의 계산서 기준 매출액 조회 / 날짜 형식은 2012-10-10
    @Select("SELECT CAST(m AS CHAR) AS m, CAST(SUM(v1) AS CHAR) AS v1, CAST(SUM(v2) AS CHAR) AS v2 FROM (SELECT CAST(MID(CAST(vatissuedate AS CHAR),6,2) AS int) AS m, IF(vattype='S',vatamount,0) AS v1, IF(vattype='B',vatamount,0) AS v2 FROM swc_vat WHERE attrib NOT LIKE 'XXX%' AND year(vatissuedate) = #{year} AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId})) a GROUP BY m")
    public List<HashMap<String, String>> getSalesStatisticsWithYear(@Param("compId") String compId, @Param("year") int year);

}
