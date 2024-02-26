package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.Unpaid;
import kr.co.bizcore.v1.domain.UnpaidSub;

public interface UnpaidMapper {

    @Select("SELECT a.*, b.settleDRbalance as custBalance, a.custName AS vatSellerName, SUM(c.vatTax + c.vatAmount) AS vatAmountB, sum(case when c.vatStatus='B5' and e.baclogTime BETWEEN #{vatIssueDateFrom} and #{vatIssueDateTo} then c.vatAmount + c.vatTax end) AS serialTotalB FROM swc_cust a LEFT JOIN swc_cust_balance b on a.custNo = b.custNo AND b.settleYear = #{selectYear} AND b.compNo = #{compNo} AND b.attrib NOT LIKE 'XXX%' AND b.settleDRbalance IS NOT NULL LEFT JOIN swc_vat c ON a.custNo = c.vatSellerCustNo AND c.vatIssueDate BETWEEN #{vatIssueDateFrom} and #{vatIssueDateTo} and c.attrib NOT LIKE 'XXX%' AND c.vatType != 'T' LEFT JOIN(SELECT * FROM swc_bacledger_detail group BY linkDocno) d ON c.vatSerial = d.linkDocno LEFT JOIN swc_bacledger e ON e.baclogId = d.baclogId WHERE a.compNo = #{compNo} AND a.custCompNo != #{compNo} GROUP BY a.custNo")
    public List<Unpaid> getUnpaidList(@Param("compNo") int compNo, @Param("selectYear") String selectYear,
            @Param("vatIssueDateFrom") String vatIssueDateFrom, @Param("vatIssueDateTo") String vatIssueDateTo);

    @Select("SELECT a.custNo, a.custName, sum(b.modal_receive_data) AS modal_receive_data FROM swc_cust a LEFT JOIN swc_vat b ON a.custNo = b.vatSellerCustNo AND (b.vatStatus = 'B3' OR b.vatStatus = 'B5') LEFT JOIN(SELECT * FROM swc_bacledger_detail group BY linkDocno) c ON b.vatSerial = c.linkDocno LEFT JOIN swc_bacledger d ON d.baclogId = c.baclogId WHERE d.linkDoc = 'y' and d.baclogTime LIKE CONCAT('%', #{selectYear}, '%') and b.attrib not like 'XXX%' GROUP BY a.custName")
    public List<UnpaidSub> getUnpaidSub(@Param("selectYear") String selectYear);

}
