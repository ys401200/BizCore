package kr.co.bizcore.v1.mapper;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.Sched;
import kr.co.bizcore.v1.domain.Schedule;
import kr.co.bizcore.v1.domain.WorkReport;

public interface ScheduleMapper {
    

    @Select("SELECT a.* FROM (" + 
        "SELECT 'etc' AS job, schedno AS no, userno AS user, custno AS cust, soppno AS sopp, schedtitle AS title, scheddesc AS detail, schedfrom AS \"from\", schedto AS \"to\", schedplace AS place, regdatetime AS created, modDatetime AS modified FROM swc_sched WHERE schedfrom < DATE_ADD(#{ymd}, INTERVAL 1 MONTH) AND schedto >= #{ymd} AND compno = (SELECT compno FROM swc_company WHERE compid =#{compId}) " +
        "UNION ALL " +
        "SELECT 'sales' AS job, salesno AS no, userno AS user, custno AS cust, soppno AS sopp, salestitle AS title, salesdesc AS detail, salesfrdatetime AS \"from\", salestodatetime AS \"to\", salesplace AS place, regdatetime AS created, modDatetime AS modified FROM swc_sales WHERE salesfrdatetime < DATE_ADD(#{ymd}, INTERVAL 1 MONTH) AND salestodatetime >= #{ymd} AND compno = (SELECT compno FROM swc_company WHERE compid =#{compId}) " +
        "UNION ALL " +
        "SELECT 'tech' AS job, techdno AS no, userno AS user, custno AS cust, soppno AS sopp, techdtitle as title, techddesc as detail, techdfrom AS \"from\", techdto AS \"to\", techdplace AS place, regdatetime AS created, modDatetime AS modified FROM swc_techd WHERE techdfrom < DATE_ADD(#{ymd}, INTERVAL 1 MONTH) AND techdto >= #{ymd} AND compno = (SELECT compno FROM swc_company WHERE compid =#{compId}) " +
    ") a WHERE a.user IN (SELECT user_no FROM bizcore.user_dept WHERE dept_id IN (#{deptIn})) ORDER BY a.from, a.user, a.job")
    public List<Sched> getSchedule(@Param("compId") String compId, @Param("ymd") String ym, @Param("deptIn") String deptIn);

    // ↑ 일정 통합 전 기존 작업 내용
    // =================================================================================================
    // ↓ 일정 통합 후 신규 작업 내용

    // === 단일 일정 조회 ===
    @Select("SELECT 'schedule' AS job, schedNo AS no, userNo AS writer, soppNo AS sopp, custNo AS customer, schedFrom AS `from`, schedTo AS `to`, schedTitle AS title, schedDesc AS content, schedCheck AS workReport, schedType AS type, schedPlace AS place, regdatetime AS created, moddatetime AS modified FROM swc_sched WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND schedno = #{no}")
    public Schedule getScheduleFromSched(@Param("compId") String compId, @Param("no") String no);

    @Select("SELECT  'sales' AS job, salesNo AS no, userNo AS writer, soppNo AS sopp, ptncNo AS customer, salesFrdatetime AS `from`, salesTodatetime AS `to`, salesTitle AS title, salesDesc AS content, salesCheck AS workReport, salesType AS type, salesPlace AS place, custNo AS partner, regdatetime AS created, moddatetime AS modified FROM swc_sales WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND salesno = #{no}")
    public Schedule getScheduleFromSales(@Param("compId") String compId, @Param("no") String no);

    @Select("SELECT 'tech' AS job, techdNo AS no, userNo AS writer, soppNo AS sopp, IF(endCustNo=100002,NULL,endCustNo) AS customer, techdFrom AS `from`, techdTo AS `to`, techdTitle AS title, techdDesc AS content, techdCheck AS workReport, techdType AS type, techdPlace AS place, custNo AS partner, contNo AS contract, cntrctMth AS contractMethod, custmemberNo AS cipOfCustomer, techdItemmodel AS supportModel, techdItemversion AS supportVersion, techdSteps AS supportStep, regdatetime AS created, moddatetime AS modified FROM swc_techd WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND techdno = #{no}")
    public Schedule getScheduleFromTechd(@Param("compId") String compId, @Param("no") String no);

    // === 일정 목록 조회 ===
    @Select("SELECT 'schedule' AS job, schedNo AS no, userNo AS writer, soppNo AS sopp, custNo AS customer, schedFrom AS `from`, schedTo AS `to`, schedTitle AS title, schedDesc AS content, schedCheck AS workReport, schedType AS type, schedPlace AS place, regdatetime AS created, moddatetime AS modified FROM swc_sched WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND #{start} <= schedto AND #{end} > schedFrom ORDER BY schedno DESC")
    public List<Schedule> getScheduleListFromSched(@Param("compId") String compId, @Param("start") Date start, @Param("end") Date end);

    @Select("SELECT 'sales' AS job, salesNo AS no, userNo AS writer, soppNo AS sopp, ptncNo AS customer, salesFrdatetime AS `from`, salesTodatetime AS `to`, salesTitle AS title, salesDesc AS content, salesCheck AS workReport, salesType AS type, salesPlace AS place, custNo AS partner, regdatetime AS created, moddatetime AS modified FROM swc_sales WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND #{start} <= salestodatetime AND #{end} > salesfrdatetime ORDER BY salesno DESC")
    public List<Schedule> getScheduleListFromSales(@Param("compId") String compId, @Param("start") Date start, @Param("end") Date end);

    @Select("SELECT 'tech' AS job, techdNo AS no, userNo AS writer, soppNo AS sopp, IF(endCustNo=100002,NULL,endCustNo) AS customer, techdFrom AS `from`, techdTo AS `to`, techdTitle AS title, techdDesc AS content, techdCheck AS workReport, techdType AS type, techdPlace AS place, custNo AS partner, contNo AS contract, cntrctMth AS contractMethod, custmemberNo AS cipOfCustomer, techdItemmodel AS supportModel, techdItemversion AS supportVersion, techdSteps AS supportStep, regdatetime AS created, moddatetime AS modified FROM swc_techd WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND #{start} <= techdto AND #{end} > techdfrom ORDER BY techdno DESC")
    public List<Schedule> getScheduleListFromTechd(@Param("compId") String compId, @Param("start") Date start, @Param("end") Date end);

    // === 부서기준 일정 조회 ===
    @Select("SELECT 'schedule' AS job, schedNo AS no, userNo AS writer, soppNo AS sopp, custNo AS customer, schedFrom AS `from`, schedTo AS `to`, schedTitle AS title, schedDesc AS content, schedCheck AS workReport, schedType AS type, schedPlace AS place, regdatetime AS created, moddatetime AS modified FROM swc_sched WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND #{start} <= schedto AND #{end} > schedFrom AND userno IN (SELECT user_no FROM bizcore.user_dept WHERE dept_id IN (#{deptIn}) AND comp_id = #{compId}) ORDER BY schedno DESC")
    public List<Schedule> getScheduleListFromSchedWithDept(@Param("compId") String compId, @Param("start") Date start, @Param("end") Date end, @Param("deptIn") String deptIn);

    @Select("SELECT 'sales' AS job, salesNo AS no, userNo AS writer, soppNo AS sopp, ptncNo AS customer, salesFrdatetime AS `from`, salesTodatetime AS `to`, salesTitle AS title, salesDesc AS content, salesCheck AS workReport, salesType AS type, salesPlace AS place, custNo AS partner, regdatetime AS created, moddatetime AS modified FROM swc_sales WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND #{start} <= salestodatetime AND #{end} > salesfrdatetime AND userno IN (SELECT user_no FROM bizcore.user_dept WHERE dept_id IN (#{deptIn}) AND comp_id = #{compId}) ORDER BY salesno DESC")
    public List<Schedule> getScheduleListFromSalesWithDept(@Param("compId") String compId, @Param("start") Date start, @Param("end") Date end, @Param("deptIn") String deptIn);

    @Select("SELECT 'tech' AS job, techdNo AS no, userNo AS writer, soppNo AS sopp, IF(endCustNo=100002,NULL,endCustNo) AS customer, techdFrom AS `from`, techdTo AS `to`, techdTitle AS title, techdDesc AS content, techdCheck AS workReport, techdType AS type, techdPlace AS place, custNo AS partner, contNo AS contract, cntrctMth AS contractMethod, custmemberNo AS cipOfCustomer, techdItemmodel AS supportModel, techdItemversion AS supportVersion, techdSteps AS supportStep, regdatetime AS created, moddatetime AS modified FROM swc_techd WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND #{start} <= techdto AND #{end} > techdfrom AND userno IN (SELECT user_no FROM bizcore.user_dept WHERE dept_id IN (#{deptIn}) AND comp_id = #{compId}) ORDER BY techdno DESC")
    public List<Schedule> getScheduleListFromTechdWithDept(@Param("compId") String compId, @Param("start") Date start, @Param("end") Date end, @Param("deptIn") String deptIn);

    // === 사용자 기준 일정 조회 ===
    @Select("SELECT 'schedule' AS job, schedNo AS no, userNo AS writer, soppNo AS sopp, custNo AS customer, schedFrom AS `from`, schedTo AS `to`, schedTitle AS title, schedDesc AS content, schedCheck AS workReport, schedType AS type, schedPlace AS place, regdatetime AS created, moddatetime AS modified FROM swc_sched WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND #{start} <= schedto AND #{end} > schedFrom AND userno = #{userNo} ORDER BY schedno DESC")
    public List<Schedule> getScheduleListFromSchedWithUser(@Param("compId") String compId, @Param("start") Date start, @Param("end") Date end, @Param("userNo") String userNo);

    @Select("SELECT 'sales' AS job, salesNo AS no, userNo AS writer, soppNo AS sopp, ptncNo AS customer, salesFrdatetime AS `from`, salesTodatetime AS `to`, salesTitle AS title, salesDesc AS content, salesCheck AS workReport, salesType AS type, salesPlace AS place, custNo AS partner, regdatetime AS created, moddatetime AS modified FROM swc_sales WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND #{start} <= salestodatetime AND #{end} > salesfrdatetime AND userno = #{userNo} ORDER BY salesno DESC")
    public List<Schedule> getScheduleListFromSalesWithUser(@Param("compId") String compId, @Param("start") Date start, @Param("end") Date end, @Param("userNo") String userNo);

    @Select("SELECT 'tech' AS job, techdNo AS no, userNo AS writer, soppNo AS sopp, IF(endCustNo=100002,NULL,endCustNo) AS customer, techdFrom AS `from`, techdTo AS `to`, techdTitle AS title, techdDesc AS content, techdCheck AS workReport, techdType AS type, techdPlace AS place, custNo AS partner, contNo AS contract, cntrctMth AS contractMethod, custmemberNo AS cipOfCustomer, techdItemmodel AS supportModel, techdItemversion AS supportVersion, techdSteps AS supportStep, regdatetime AS created, moddatetime AS modified FROM swc_techd WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND #{start} <= techdto AND #{end} > techdfrom AND userno = #{userNo} ORDER BY techdno DESC")
    public List<Schedule> getScheduleListFromTechdWithUser(@Param("compId") String compId, @Param("start") Date start, @Param("end") Date end, @Param("userNo") String userNo);

    // === SOPP 기준 일정 조회 ===
    @Select("SELECT 'schedule' AS job, schedNo AS no, userNo AS writer, soppNo AS sopp, custNo AS customer, schedFrom AS `from`, schedTo AS `to`, schedTitle AS title, schedDesc AS content, schedCheck AS workReport, schedType AS type, schedPlace AS place, regdatetime AS created, moddatetime AS modified FROM swc_sched WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND soppno = #{soppNo} ORDER BY schedno DESC")
    public List<Schedule> getScheduleListFromSchedWithSopp(@Param("compId") String compId, @Param("soppNo") String soppNo);

    @Select("SELECT 'sales' AS job, salesNo AS no, userNo AS writer, soppNo AS sopp, ptncNo AS customer, salesFrdatetime AS `from`, salesTodatetime AS `to`, salesTitle AS title, salesDesc AS content, salesCheck AS workReport, salesType AS type, salesPlace AS place, custNo AS partner, regdatetime AS created, moddatetime AS modified FROM swc_sales WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND soppno = #{soppNo} ORDER BY salesno DESC")
    public List<Schedule> getScheduleListFromSalesWithSopp(@Param("compId") String compId, @Param("soppNo") String soppNo);

    @Select("SELECT 'tech' AS job, techdNo AS no, userNo AS writer, soppNo AS sopp, IF(endCustNo=100002,NULL,endCustNo) AS customer, techdFrom AS `from`, techdTo AS `to`, techdTitle AS title, techdDesc AS content, techdCheck AS workReport, techdType AS type, techdPlace AS place, custNo AS partner, contNo AS contract, cntrctMth AS contractMethod, custmemberNo AS cipOfCustomer, techdItemmodel AS supportModel, techdItemversion AS supportVersion, techdSteps AS supportStep, regdatetime AS created, moddatetime AS modified FROM swc_techd WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND soppno = #{soppNo} ORDER BY techdno DESC")
    public List<Schedule> getScheduleListFromTechdWithsopp(@Param("compId") String compId, @Param("soppNo") String soppNo);

    // 일정삭제
    @Update("UPDATE swc_sched SET attrib = 'XXXXX' WHERE compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND schedno = #{no}")
    public int deleteSched(@Param("compId") String compId, @Param("no") String no);

    @Update("UPDATE swc_sales SET attrib = 'XXXXX' WHERE compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND salesno = #{no}")
    public int deleteSales(@Param("compId") String compId, @Param("no") String no);

    @Update("UPDATE swc_techd SET attrib = 'XXXXX' WHERE compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND techdno = #{no}")
    public int deleteTechd(@Param("compId") String compId, @Param("no") String no);

    @Select("SELECT a.userno AS writer, IF(a.prcheck=1,a.prcomment,'') AS content1, IF(a.thcheck=1,a.thcomment,'') AS content2 " +
            "FROM swc_sreport a, " +
            "(SELECT MAX(sreportno) no, userno FROM swc_sreport WHERE weeknum = #{week} GROUP BY userno) b " +
            "WHERE a.attrib = 11111 AND a.userno = b.userno AND a.sreportno = b.no AND a.compno = (SELECT compno FROM swc_company WHERE compid = #{compId})")
    public List<WorkReport> getWorkReportsCompany(@Param("compId") String compId, @Param("week") int week);

    @Select("SELECT a.userno AS writer, IF(a.prcheck=1,a.prcomment,'') AS content1, IF(a.thcheck=1,a.thcomment,'') AS content2 " +
            "FROM swc_sreport a, " +
            "(SELECT MAX(sreportno) no, userno FROM swc_sreport WHERE weeknum = #{week} GROUP BY userno) b " +
            "WHERE a.attrib = 11111 AND a.userno = b.userno AND a.sreportno = b.no AND a.compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND a.userno IN (SELECT user_no FROM bizcore.user_dept WHERE dept_id IN (#{deptIn}))")
    public List<WorkReport> getWorkReportsDept(@Param("compId") String compId, @Param("week") int week, @Param("deptIn") String deptIn);

    @Select("SELECT a.userno AS writer, a.prcheck AS currentWeekCheck, a.prcomment AS currentWeek, a.thcheck AS nextWeekCheck, a.thcomment AS nextWeek " +
            "FROM swc_sreport a, " +
            "(SELECT MAX(sreportno) no, userno FROM swc_sreport WHERE weeknum = #{week} GROUP BY userno) b " +
            "WHERE a.attrib = 11111 AND a.userno = b.userno AND a.sreportno = b.no AND a.compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND a.userno = #{userNo}")
    public WorkReport getWorkReportPersonal(@Param("compId") String compId, @Param("week") int week, @Param("userNo") String userNo);

    @Select("SELECT 'schedule' AS job, schedFrom AS `from`, schedtitle AS title, schedDesc AS content FROM swc_sched WHERE schedCheck = 1 AND attrib NOT LIKE 'XXX%' AND userno = #{writer} AND schedfrom < #{end} AND schedto >= #{start} AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) " +
                "UNION ALL " + 
                "SELECT 'sales' AS job, salesfrdatetime AS `from`, salestitle AS title, salesdesc AS content FROM swc_sales WHERE salescheck = 1 AND attrib = 11111 AND userno = #{writer} AND salesfrdatetime < #{end} AND salestodatetime >= #{start} AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) " +
                "UNION ALL " + 
                "SELECT 'tech' AS job, techdfrom AS `from`, techdtitle AS title, techddesc AS content FROM swc_techd WHERE techdcheck = 1 AND attrib = 11111 AND userno = #{writer} AND techdfrom < #{end} AND techdto >= #{start} AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId})")
    public List<Schedule> getScheduleListForReport(@Param("compId") String compId, @Param("start") Date start, @Param("end") Date end, @Param("writer") int writer);

    @Update("UPDATE swc_sreport SET attrib = 'XXXXX' WHERE userno = #{userNo} AND weeknum = #{week} AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId})")
    public int deleteWorkReport(@Param("compId") String compId, @Param("userNo") String userNo, @Param("week") int week);
}
