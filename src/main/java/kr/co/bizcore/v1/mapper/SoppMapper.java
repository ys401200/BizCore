package kr.co.bizcore.v1.mapper;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.Estimate;
import kr.co.bizcore.v1.domain.EstimateItem;
import kr.co.bizcore.v1.domain.SimpleEstimate;
import kr.co.bizcore.v1.domain.SimpleSopp;
import kr.co.bizcore.v1.domain.Sopp;

public interface SoppMapper {

    @Select("SELECT soppno AS no, sopptype AS soppType, cntrctmth AS contType, sopptitle AS title, buyrno AS customer, custno AS endUser, userno AS employee, sopptargetamt AS expectedSales, soppstatus AS status, regdatetime AS created, moddatetime AS modified " +
        "FROM swc_sopp " + 
        "WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY soppno DESC")
    public List<SimpleSopp> getSoppList(String compId);

    @Select("SELECT soppno AS no, sopptype AS soppType, cntrctMth AS contType, sopptitle AS title, buyrno AS customer, custNo AS enduser, userNo AS employee, sopptargetamt AS expectedSales, soppstatus AS status, " + 
            "contno AS contract, (SELECT q.custMname FROM swc_custData03 q WHERE q.custData03no = custMemberNo) AS picOfCustomer, " + 
            "ptncno AS ptnc, ptncmemberno AS picOfPtnc, buyrmemberno AS picOfBuyer, soppDesc AS detail,  " + 
            "sopptargetdate AS targetDate, maintenance_s AS startOfMaintenance, maintenance_e AS endOfMaintenance, soppsrate AS progress, soppsource AS source, " + 
            "sopp2desc AS remark, sopp2regdatetime AS remarkDate, businessType, op_priority AS priority, regDatetime AS created, modDatetime AS modified " + 
            "FROM swc_sopp " + 
            "WHERE attrib NOT LIKE 'XXX%' " + 
            "AND soppno = #{soppNo} AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId})")
    public Sopp getSopp(@Param("soppNo") String soppNo, @Param("compId") String compId);

    @Update("UPDATE swc_sopp SET attrib = 'XXXXX' WHERE soppno = #{no} AND compno = (SELECT compno FROM swcore.swc_company WHERE compid = #{compId})")
    public int removeSopp(@Param("no") String no, @Param("compId") String compId);

    @Select("SELECT a.estno AS no, estid AS id, esttitle AS title, estdesc AS remark, custno AS customer, userno AS writer, estamount AS amount, estvat AS tax, esttotal AS total, estdate AS date FROM swc_est a, (SELECT estid AS id, MAX(estver) AS ver FROM swc_est WHERE estid IS NOT NULL AND attrib NOT LIKE 'XXX%' GROUP BY estid) b WHERE a.estid = b.id AND a.estver = b.ver AND a.compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY estno DESC")
    public List<SimpleEstimate> getEstimateList(String compId);

    @Select("SELECT a.estno AS no, estid AS id, estver AS ver, esttype AS type, esttitle AS title, estdesc AS remark, custno AS customer, soppno AS sopp, userno AS writer, estamount AS amount, estvat AS tax, estdiscount AS discount, esttotal AS total, estdate AS date, regdate AS created, moddate AS modified FROM swc_est a, (SELECT estid AS id, MAX(estver) AS ver FROM swc_est WHERE estid IS NOT NULL AND attrib NOT LIKE 'XXX%' GROUP BY estid) b WHERE a.estid = b.id AND a.estno = #{no} AND a.estver = b.ver AND a.compno = (SELECT compno FROM swc_company WHERE compid = {compId|) ORDER BY estno DESC")
    public Estimate getEstimate(@Param("no") String no, @Param("compId") String compId);

    @Select("SELECT estcomname company, estcpomboss ceo, a.estcomadd address, estcomphone phone, estcomfax fax, estcomterm period, estcomspec content FROM swc_estinfo WHERE estid = #{id} AND estver = #{ver}")
    public HashMap<String, String> getEstimateInfo(@Param("id") String id, @Param("ver") int ver);

    @Select("SELECT estitemno no, itemkinds kind, itemtitle title, custno customer, productNo, productName, productSpec, productqty qty, productnetprice price, productvat tax, productamount amount, productdis discount, producttotal total, productremark remark, regdate created, moddate modified FROM swc_estitems WHERE estid = #{id} AND estver = #{ver}")
    public List<EstimateItem> getEstimateItems(@Param("id") String id, @Param("ver") int ver);
}
