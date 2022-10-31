package kr.co.bizcore.v1.mapper;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.BankAccount;
import kr.co.bizcore.v1.domain.SimpleTaxBill;
import kr.co.bizcore.v1.domain.TaxBill;

public interface AccountingMapper {
        @Select("SELECT vatid AS no, vattype AS type, vatissuedate AS issueDate, vattradedate AS tradeDate, vatno AS regNo, vatserial AS sn, vatamount AS amount, vattax AS tax, vatproductname AS product, vatremark AS remark, vatBuyerCustNo AS buyerCustomer, vatSellerCustNo AS sellerCustomer, vatStatus AS status, vatStandard AS standard, regdate AS created, modDate AS modified " + 
                "FROM swc_vat WHERE attrib NOT LIKE 'XXX%' AND vatType = #{type} AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY issueDate desc")
        public List<SimpleTaxBill> getSimpleAllList(@Param("compId") String compId, @Param("type") String type);

        @Select("SELECT vatid AS no, vattype AS type, vatissuedate AS issueDate, vattradedate AS tradeDate, vatno AS regNo, vatserial AS sn, vatamount AS amount, vattax AS tax, vatproductname AS product, vatremark AS remark, vatBuyerCustNo AS buyerCustomer, vatSellerCustNo AS sellerCustomer, vatStatus AS status, vatStandard AS standard, regdate AS created, modDate AS modified " + 
                "FROM swc_vat WHERE attrib NOT LIKE 'XXX%' AND vatType = #{type} AND vatIssueDate BETWEEN #{startDate} and #{endDate} AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY issueDate desc")
        public List<SimpleTaxBill> getSimpleYearList(@Param("compId") String compId, @Param("type") String type, @Param("startDate") String startDate, @Param("endDate") String endDate);

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

        // 은행 계좌 목록을 가져오는 메서드
        @Select("SELECT a.no, a.bankCode, a.branch, a.account, a.`type`, a.remark, a.serial, a.depositor, a.`limit`, b.balance, a.updated, a.established, a.created, a.modified, a.deleted " +
                "FROM bizcore.bank_account a, " +
                "(SELECT b.bank, b.account, b.balance FROM bizcore.bank_account_ledger b, (SELECT bank, account, MAX(dt) AS dt FROM bizcore.bank_account_ledger WHERE deleted IS NULL AND compId = #{compId} GROUP BY bank, account) c WHERE b.bank = c.bank AND b.account = c.account AND b.dt = c.dt) b " +
                "WHERE a.deleted IS NULL AND a.compId = #{compId} AND a.bankcode = b.bank AND a.account = b.account ORDER BY no")
        public List<BankAccount> getBankAccountList(@Param("compId") String compId);

        // 특정 계좌의 거래내역을 가져오는 메서드
        @Select("SELECT CAST(UNIX_TIMESTAMP(dt) * 1000 AS CHAR) AS dt, `desc`, CAST(deposit AS CHAR) AS deposit, CAST(withdraw AS CHAR) AS withdraw, CAST(balance AS CHAR) AS balance, branch, memo1, memo2, link FROM bizcore.bank_account_ledger WHERE deleted IS NULL AND compId = #{compId} AND bank = #{bank} AND account = #{account} ORDER BY dt DESC")
        public List<HashMap<String, String>> getBankDetail(@Param("compId") String compId, @Param("bank") String bank, @Param("account") String account);

        // 특정 계좌, 특정 거래건의 메모를 입력하는 메서드
        @Update("UPDATE bizcore.bank_account_ledger SET memo2 = #{memo} WHERE deleted IS NULL AND compId = #{compId} AND bank = #{bank} AND account = #{account} AND UNIX_TIMESTAMP(dt)*1000 = #{dt} AND deposit = #{deposit} AND withdraw = #{withdraw} AND balance = #{balance} AND `desc` = #{desc}")
        public int updateBankAccHistoryMemo(@Param("compId") String compId, @Param("bank") String bank, @Param("account") String account, @Param("dt") long dt, @Param("memo") String memo, @Param("deposit") long deposit, @Param("withdraw") long withdraw, @Param("balance") long balance, @Param("desc") String desc);

        // 특정 기간의 거래내역을 가져오는 메서드
        @Select("SELECT CAST(UNIX_TIMESTAMP(dt) * 1000 AS CHAR) AS dt, `desc`, CAST(deposit AS CHAR) AS deposit, CAST(withdraw AS CHAR) AS withdraw, CAST(balance AS CHAR) AS balance, branch, memo1, memo2, link FROM bizcore.bank_account_ledger WHERE deleted IS NULL AND compId = #{compId} AND bank = #{bank} AND account = #{account} AND UNIX_TIMESTAMP(dt)*1000 >= #{dtFrom} AND UNIX_TIMESTAMP(dt)*1000 <= #{dtTo} ORDER BY dt DESC")
        public List<HashMap<String, String>> getDetailWithDate(@Param("compId") String compId, @Param("bank") String bank, @Param("account") String account, @Param("dtFrom") long from, @Param("dtTo") long to);

        // 은행 거래내역을 추가하는 메서드
        @Insert("INSERT INTO bizcore.bank_account_ledger(compId, bank, account, dt, `desc`, deposit, withdraw, balance, branch, remark, created) VALUES(#{compId}, #{bank}, #{account}, #{dt}, #{desc}, #{deposit}, #{withdraw}, #{balance}, #{branch}, #{remark}, NOW())")
        public int addDetail(@Param("compId") String compId, @Param("bank") String bank, @Param("account") String account, @Param("dt") Date dt, @Param("desc") String desc, @Param("deposit") long deposit, @Param("withdraw") long withdraw, @Param("balance") long balance, @Param("branch") String branch, @Param("remark") String remark);

        // 연월과 사번을 입력받고 사용중인 카드의ㅣ 사용 내역을 가져오는 메서드
        @Select("SELECT CAST(cardLogNo AS CHAR) AS no, CAST(appDate AS CHAR) AS dt, cardDisNum AS card, appContents AS content, CAST(appAmount AS CHAR) AS total FROM swcore.swc_cardledger WHERE attrib NOT LIKE 'XXX%' AND carddisnum IN (SELECT carddisnum FROM swcore.swc_card WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swcore.swc_company WHERE compid = #{compId}) and user_card = #{userNo}) AND YEAR(appdate)*100+MONTH(appdate) = #{ym} ORDER BY appdate, apptime")
        public List<HashMap<String, String>> getCorporateCardDetailData(@Param("compId") String compId, @Param("userNo") String userNo, @Param("ym") int ym);
}
