package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.Receivable;
import kr.co.bizcore.v1.domain.ReceivableSub;

public interface ReceivableMapper {

    @Select("SELECT a.*, b.settleCRbalance as custBalance, a.custName AS vatBuyerName, SUM(c.vatTax + c.vatAmount) AS vatAmountS, sum(case when c.vatStatus='S5' and e.baclogTime BETWEEN #{vatIssueDateFrom} and #{vatIssueDateTo} then c.vatAmount + c.vatTax end) AS serialTotalS FROM swc_cust a LEFT JOIN swc_cust_balance b on a.custNo = b.custNo AND b.settleYear = #{selectYear} AND b.compNo = #{compNo} AND b.attrib NOT LIKE 'XXX%' AND b.settleCRbalance IS NOT NULL LEFT JOIN swc_vat c ON a.custNo = c.vatBuyerCustNo AND c.vatIssueDate BETWEEN #{vatIssueDateFrom} and #{vatIssueDateTo} and c.attrib NOT LIKE 'XXX%' AND c.vatType != 'T' LEFT JOIN(SELECT * FROM swc_bacledger_detail group BY linkDocno) d ON c.vatSerial = d.linkDocno LEFT JOIN swc_bacledger e ON e.baclogId = d.baclogId WHERE a.compNo = #{compNo} AND a.custCompNo != #{compNo} GROUP BY a.custNo")
    public List<Receivable> getReceivableList(@Param("compNo") int compNo,
            @Param("selectYear") String selectYear, @Param("vatIssueDateFrom") String vatIssueDateFrom,
            @Param("vatIssueDateTo") String vatIssueDateTo);

    @Select("SELECT a.custNo, a.custName, sum(b.modal_receive_data) AS modal_receive_data  FROM swc_cust a LEFT JOIN swc_vat b ON a.custNo = b.vatBuyerCustNo AND (b.vatStatus = 'S3' OR b.vatStatus = 'S5') LEFT JOIN(SELECT * FROM swc_bacledger_detail group BY linkDocno) c ON b.vatSerial = c.linkDocno  LEFT JOIN swc_bacledger d ON d.baclogId = c.baclogId WHERE d.linkDoc = 'y' and d.baclogTime LIKE CONCAT('%', #{selectYear}, '%') and b.attrib not like 'XXX%' GROUP BY a.custName")
    public List<ReceivableSub> getReceivableSub(@Param("selectYear") String selectYear);

}
