package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.Unpaid;
import kr.co.bizcore.v1.domain.UnpaidTarget;

public interface UnpaidMapper {

    // @Select("SELECT unpaidno AS no, unpaidtitle AS title, unpaidfrdatetime AS
    // \"from\", unpaidtodatetime AS \"to\", soppno AS sopp, userno AS user, custno
    // AS customer, ptncno AS endUser, regdatetime AS created, moddatetime AS
    // modified, " +
    // "unpaiddesc AS detail, unpaidplace AS place, unpaidtype AS type, unpaidcheck
    // AS
    // chk, schedType " +
    // "FROM swc_unpaid WHERE attrib NOT LIKE 'XXX%' AND unpaidno = #{no} AND compno
    // =
    // (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY created
    // DESC")
    // public Unpaid getUnpaid(@Param("unpaidNo") String unpaidNo, @Param("compNo")
    // int
    // compNo);

    // @Select("SELECT unpaidno AS no, unpaidtitle AS title, unpaidfrdatetime AS
    // \"from\", unpaidtodatetime AS \"to\", soppno AS sopp, userno AS user, custno
    // AS customer, ptncno AS endUser, regdatetime AS created, moddatetime AS
    // modified " +
    // "FROM swc_unpaid WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno
    // FROM
    // swc_company WHERE compid = #{compId}) ORDER BY created DESC")
    // public List<Unpaid> getUnpaidList(String compId);
    @Select("SELECT * FROM swc_cust_balance WHERE attrib NOT LIKE 'XXX%' AND unpaidNo = #{unpaidNo} AND compNo = #{compNo}")
    public Unpaid getUnpaid(@Param("unpaidNo") String unpaidNo, @Param("compNo") int compNo);

    @Select("SELECT a.*, b.settleDRbalance as custBalance, a.custName AS vatSellerName, SUM(c.vatTax + c.vatAmount) AS vatAmountB, sum(case when c.vatStatus='B5' then c.vatAmount + c.vatTax end) AS serialTotalB FROM swc_cust a LEFT JOIN swc_cust_balance b on a.custNo = b.custNo AND b.settleYear = #{selectYear} AND b.compNo = #{compNo} AND b.attrib NOT LIKE 'XXX%' AND b.settleDRbalance IS NOT NULL LEFT JOIN swc_vat c ON a.custNo = c.vatSellerCustNo AND c.vatIssueDate BETWEEN #{vatIssueDateFrom} and #{vatIssueDateTo} and c.attrib NOT LIKE 'XXX%' AND c.vatType != 'T' WHERE a.compNo = #{compNo} AND a.custCompNo != #{compNo} GROUP BY a.custNo")
    public List<Unpaid> getUnpaidList(@Param("unpaid") Unpaid unpaid, @Param("compNo") int compNo,
            @Param("selectYear") String selectYear, @Param("vatIssueDateFrom") String vatIssueDateFrom,
            @Param("vatIssueDateTo") String vatIssueDateTo);

    // @Insert("INSERT INTO swc_unpaid (soppNo, userNo, compNo, custNo, schedFrom,
    // schedTo, unpaidPlace, schedType, `type`, `desc`, `title`, ptncNo,
    // regDatetime) VALUES (#{unpaid.soppNo}, #{unpaid.userNo}, #{unpaid.compNo},
    // #{unpaid.custNo}, #{unpaid.schedFrom}, #{unpaid.schedTo},
    // #{unpaid.unpaidPlace}, '10165', #{unpaid.type}, #{unpaid.desc},
    // #{unpaid.title}, #{unpaid.ptncNo}, now())")
    // public int unpaidInsert(@Param("unpaid") Unpaid unpaid);

    // @Update("UPDATE swc_unpaid SET attrib = 'XXXXX' WHERE unpaidNo = #{unpaidNo}
    // AND compNo = #{compNo}")
    // public int unpaidDelete(@Param("compNo") int compNo, @Param("unpaidNo")
    // String unpaidNo);

    // @Update("UPDATE swc_unpaid SET soppNo = #{unpaid.soppNo}, userNo =
    // #{unpaid.userNo}, custNo = #{unpaid.custNo}, schedFrom = #{unpaid.schedFrom},
    // schedTo = #{unpaid.schedTo}, unpaidPlace = #{unpaid.unpaidPlace}, `type` =
    // #{unpaid.type}, `desc` = #{unpaid.desc}, `title` = #{unpaid.title}, ptncNo =
    // #{unpaid.ptncNo}, modDatetime = now() WHERE unpaidNo = #{unpaid.unpaidNo} AND
    // compNo = #{unpaid.compNo}")
    // public int updateUnpaid(@Param("unpaid") Unpaid unpaid);

    // @Select("SELECT swc_user.userNo, swc_user.compNo,
    // swc_unpaid_target.targetYear, IFNULL(swc_unpaid_target.mm01, 0) as mm01,
    // IFNULL(swc_unpaid_target.mm02, 0) as mm02, IFNULL(swc_unpaid_target.mm03, 0)
    // as mm03, IFNULL(swc_unpaid_target.mm04, 0) as mm04,
    // IFNULL(swc_unpaid_target.mm05, 0) as mm05, IFNULL(swc_unpaid_target.mm06, 0)
    // as mm06, IFNULL(swc_unpaid_target.mm07, 0) as mm07,
    // IFNULL(swc_unpaid_target.mm08, 0) as mm08, IFNULL(swc_unpaid_target.mm09, 0)
    // as mm09, IFNULL(swc_unpaid_target.mm10, 0) as mm10,
    // IFNULL(swc_unpaid_target.mm11, 0) as mm11, IFNULL(swc_unpaid_target.mm12, 0)
    // as mm12, swc_unpaid_target.targetType, swc_user.attrib FROM swc_user LEFT
    // JOIN swc_unpaid_target ON swc_unpaid_target.userNo = swc_user.userNo AND
    // swc_unpaid_target.targetYear = #{getYear} WHERE swc_user.attrib NOT LIKE
    // 'XXX%' AND swc_user.compNo = #{unpaidTarget.compNo} GROUP BY
    // swc_user.userNo")
    // public List<UnpaidTarget> getGoalList(@Param("unpaidTarget") UnpaidTarget
    // unpaidTarget,
    // @Param("getYear") int getYear);

    // @Insert("INSERT INTO swc_unpaid_target (compNo, deptNo, userNo, targetYear,
    // mm01, mm02, mm03, mm04, mm05, mm06, mm07, mm08, mm09, mm10, mm11, mm12,
    // targetType, regDatetime) VALUES (#{unpaidTarget.compNo},
    // #{unpaidTarget.deptNo}, #{unpaidTarget.userNo}, #{unpaidTarget.targetYear},
    // #{unpaidTarget.mm01}, #{unpaidTarget.mm02}, #{unpaidTarget.mm03},
    // #{unpaidTarget.mm04}, #{unpaidTarget.mm05}, #{unpaidTarget.mm06},
    // #{unpaidTarget.mm07}, #{unpaidTarget.mm08}, #{unpaidTarget.mm09},
    // #{unpaidTarget.mm10}, #{unpaidTarget.mm11}, #{unpaidTarget.mm12},
    // #{unpaidTarget.targetType}, now())")
    // public int goalInsert(@Param("unpaidTarget") UnpaidTarget unpaidTarget);

    // @Update("UPDATE swc_unpaid_target SET deptNo = #{unpaidTarget.deptNo}, userNo
    // = #{unpaidTarget.userNo}, mm01 = #{unpaidTarget.mm01}, mm02 =
    // #{unpaidTarget.mm02}, mm03 = #{unpaidTarget.mm03}, mm04 =
    // #{unpaidTarget.mm04}, mm05 = #{unpaidTarget.mm05}, mm06 =
    // #{unpaidTarget.mm06}, mm07 = #{unpaidTarget.mm07}, mm08 =
    // #{unpaidTarget.mm08}, mm09 = #{unpaidTarget.mm09}, mm10 =
    // #{unpaidTarget.mm10}, mm11 = #{unpaidTarget.mm11}, mm12 =
    // #{unpaidTarget.mm12}, targetType = #{unpaidTarget.targetType}, modDatetime =
    // now() WHERE userNo = #{unpaidTarget.userNo} AND compNo =
    // #{unpaidTarget.compNo} AND targetYear = #{unpaidTarget.targetYear}")
    // public int goalUpdate(@Param("unpaidTarget") UnpaidTarget unpaidTarget);
}
