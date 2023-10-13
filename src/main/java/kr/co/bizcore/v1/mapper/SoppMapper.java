package kr.co.bizcore.v1.mapper;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.Estimate;
import kr.co.bizcore.v1.domain.EstimateItem;
import kr.co.bizcore.v1.domain.Inout;
import kr.co.bizcore.v1.domain.Sales;
import kr.co.bizcore.v1.domain.SimpleEstimate;
import kr.co.bizcore.v1.domain.Sopp;
import kr.co.bizcore.v1.domain.SoppFileData;
import kr.co.bizcore.v1.domain.Tech;

public interface SoppMapper {

    @Select("SELECT * FROM swc_sopp WHERE attrib NOT LIKE 'XXX%' AND compNo = #{sopp.compNo} ORDER BY regDatetime DESC")
    public List<Sopp> getSoppList(@Param("sopp") Sopp sopp);

    @Select("SELECT * FROM swc_sopp WHERE attrib NOT LIKE 'XXX%' AND soppNo = #{soppNo} AND compNo = #{compNo}")
    public Sopp getSopp(@Param("soppNo") String soppNo, @Param("compNo") int compNo);

    @Insert("INSERT INTO swc_sopp (userNo, compNo, custNo, contNo, custMemberNo, buyrNo, cntrctMth, soppTitle, soppDesc, soppTargetAmt, soppTargetDate, maintenance_S, maintenance_E, soppType, soppStatus, soppSrate, maintenanceTarget, secondUserNo, categories, regDatetime) VALUES (#{sopp.userNo}, #{sopp.compNo}, #{sopp.custNo}, #{sopp.contNo}, #{sopp.custMemberNo}, #{sopp.buyrNo}, #{sopp.cntrctMth}, #{sopp.soppTitle}, #{sopp.soppDesc}, #{sopp.soppTargetAmt}, #{sopp.soppTargetDate}, #{sopp.maintenance_S}, #{sopp.maintenance_E}, #{sopp.soppType}, #{sopp.soppStatus}, #{sopp.soppSrate}, #{sopp.maintenanceTarget}, #{sopp.secondUserNo}, #{sopp.categories}, now())")
    public int soppInsert(@Param("sopp") Sopp sopp);

    @Insert("INSERT INTO swc_soppfiledata (fileId, fileName, fileDesc, uploadDate, fileContent, fileSize, fileExtention, soppNo, userNo, regDatetime, attrib) VALUES (#{soppFileData.fileId}, #{soppFileData.fileName}, #{soppFileData.fileDesc}, now(), #{soppFileData.fileContent}, #{soppFileData.fileSize}, #{soppFileData.fileExtention}, #{soppFileData.soppNo}, #{soppFileData.userNo}, now(), '10000')")
    public int soppFileInsert(@Param("soppFileData") SoppFileData soppFileData);

    @Update("UPDATE swc_soppfiledata SET attrib = 'XXXXX' WHERE fileId = #{fileId}")
    public int soppFileDelete(@Param("fileId") String fileId);

    @Update("UPDATE swc_sopp SET attrib = 'XXXXX' WHERE soppNo = #{soppNo} AND compNo = #{compNo}")
    public int soppDelete(@Param("compNo") int compNo, @Param("soppNo") String soppNo);

    @Update("UPDATE swc_sopp SET custNo = #{sopp.custNo}, custMemberNo = #{sopp.custMemberNo}, buyrNo = #{sopp.buyrNo}, cntrctMth = #{sopp.cntrctMth}, soppTitle = #{sopp.soppTitle}, soppDesc = #{sopp.soppTitle}, soppTargetAmt = #{sopp.soppTargetAmt}, soppTargetDate = #{sopp.soppTargetDate}, maintenance_S = #{sopp.maintenance_S}, maintenance_E = #{sopp.maintenance_E}, soppType = #{sopp.soppType}, soppStatus = #{sopp.soppStatus}, soppSrate = #{sopp.soppSrate}, maintenanceTarget = #{sopp.maintenanceTarget}, secondUserNo = #{sopp.secondUserNo}, categories = #{sopp.categories}, modDatetime = now() WHERE soppNo = #{sopp.soppNo} AND compNo = #{sopp.compNo}")
    public int updateSopp(@Param("sopp") Sopp sopp);

    @Select("SELECT * FROM swc_soppdata01 WHERE attrib NOT LIKE 'XXX%' AND soppNo = #{inout.soppNo} ORDER BY regDatetime DESC")
    public List<Inout> getSoppInoutList(@Param("inout") Inout inout);

    @Select("SELECT * FROM swc_soppfiledata WHERE attrib NOT LIKE 'XXX%' AND soppNo = #{soppFileData.soppNo} ORDER BY regDatetime DESC")
    public List<SoppFileData> getSoppFileList(@Param("soppFileData") SoppFileData soppFileData);

    @Select("SELECT * FROM swc_techd WHERE attrib NOT LIKE 'XXX%' AND soppNo = #{tech.soppNo} AND compNo = #{tech.compNo} ORDER BY regDatetime DESC")
    public List<Tech> getSoppTechList(@Param("tech") Tech tech);

    @Select("SELECT * FROM swc_Sales WHERE attrib NOT LIKE 'XXX%' AND soppNo = #{sales.soppNo} AND compNo = #{sales.compNo} ORDER BY regDatetime DESC")
    public List<Sales> getSoppSalesList(@Param("sales") Sales sales);

    @Select("SELECT * FROM swc_soppFileData WHERE fileId = #{soppFileData.fileId} AND soppNo = #{soppFileData.soppNo}")
    public SoppFileData downloadFile(@Param("soppFileData") SoppFileData soppFileData);

    // @Select("SELECT soppno AS no, sopptype AS soppType, cntrctMth AS contType, sopptitle AS title, buyrno AS customer, custNo AS enduser, userNo AS employee, sopptargetamt AS expectedSales, soppstatus AS status, " + 
    //         "contno AS contract, custMemberNo AS picOfCustomer, " + 
    //         "ptncno AS ptnc, ptncmemberno AS picOfPtnc, buyrmemberno AS picOfBuyer, soppDesc AS detail,  " + 
    //         "sopptargetdate AS targetDate, maintenance_s AS startOfMaintenance, maintenance_e AS endOfMaintenance, soppsrate AS progress, soppsource AS source, " + 
    //         "sopp2desc AS remark, sopp2regdatetime AS remarkDate, businessType, op_priority AS priority, regDatetime AS created, modDatetime AS modified " + 
    //         "FROM swcore.swc_sopp " + 
    //         "WHERE attrib NOT LIKE 'XXX%' " + 
    //         "AND soppno = #{soppNo} AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId})")
    // public Sopp getSopp(@Param("soppNo") String soppNo, @Param("compId") String compId);

    // @Update("UPDATE swc_sopp SET attrib = 'XXXXX' WHERE soppno = #{no} AND compno = (SELECT compno FROM swcore.swc_company WHERE compid = #{compId})")
    // public int removeSopp(@Param("no") String no, @Param("compId") String compId);

    // @Select("SELECT a.estno AS no, estid AS id, esttitle AS title, estdesc AS remark, custno AS customer, userno AS writer, estamount AS amount, estvat AS tax, esttotal AS total, estdate AS date FROM swc_est a, (SELECT estid AS id, MAX(estver) AS ver FROM swc_est WHERE estid IS NOT NULL AND attrib NOT LIKE 'XXX%' GROUP BY estid) b WHERE a.estid = b.id AND a.estver = b.ver AND a.compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY estno DESC")
    // public List<SimpleEstimate> getEstimateList(String compId);

    // @Select("SELECT a.estno AS no, estid AS id, estver AS ver, esttype AS type, esttitle AS title, estdesc AS remark, custno AS customer, soppno AS sopp, userno AS writer, estamount AS amount, estvat AS tax, estdiscount AS discount, esttotal AS total, estdate AS date, regdate AS created, moddate AS modified FROM swc_est a, (SELECT estid AS id, MAX(estver) AS ver FROM swc_est WHERE estid IS NOT NULL AND attrib NOT LIKE 'XXX%' GROUP BY estid) b WHERE a.estid = b.id AND a.estno = #{no} AND a.estver = b.ver AND a.compno = (SELECT compno FROM swc_company WHERE compid = {compId|) ORDER BY estno DESC")
    // public Estimate getEstimate(@Param("no") String no, @Param("compId") String compId);

    // @Select("SELECT estcomname company, estcpomboss ceo, a.estcomadd address, estcomphone phone, estcomfax fax, estcomterm period, estcomspec content FROM swc_estinfo WHERE estid = #{id} AND estver = #{ver}")
    // public HashMap<String, String> getEstimateInfo(@Param("id") String id, @Param("ver") int ver);

    // @Select("SELECT estitemno no, itemkinds kind, itemtitle title, custno customer, productNo, productName, productSpec, productqty qty, productnetprice price, productvat tax, productamount amount, productdis discount, producttotal total, productremark remark, regdate created, moddate modified FROM swc_estitems WHERE estid = #{id} AND estver = #{ver}")
    // public List<EstimateItem> getEstimateItems(@Param("id") String id, @Param("ver") int ver);
}
