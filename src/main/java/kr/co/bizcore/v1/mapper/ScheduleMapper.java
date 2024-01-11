package kr.co.bizcore.v1.mapper;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.Sales;
import kr.co.bizcore.v1.domain.Schedule;
import kr.co.bizcore.v1.domain.Schedule3;
import kr.co.bizcore.v1.domain.Tech;
import kr.co.bizcore.v1.domain.WorkReport;

public interface ScheduleMapper {
    @Select(
        "select salesNo as `no`, compNo, custNo, userNo, schedFrom, schedTo, `title`, `desc`, salesPlace as place, schedType, `type`, regDatetime from swc_sales where schedFrom between #{calDate} and #{nowDate} and schedTo between #{calDate} and #{nowDate} and compNo = #{compNo} and attrib not like 'XXX%'\r\n" +
        " union all " + 
        "select schedNo as `no`, compNo, custNo, userNo, schedFrom, schedTo, `title`, `desc`, schedPlace as place, schedType, `type`, regDatetime from swc_sched where schedFrom between #{calDate} and #{nowDate} and schedTo between #{calDate} and #{nowDate} and compNo = #{compNo} and attrib not like 'XXX%'\r\n" +
        " union all " +
        "select techdNo as `no`, compNo, custNo, userNo, schedFrom, schedTo, `title`, `desc`, techdPlace as place, schedType, `type`, regDatetime from swc_techd where schedFrom between #{calDate} and #{nowDate} and schedTo between #{calDate} and #{nowDate} and compNo = #{compNo} and attrib not like 'XXX%' order by schedFrom asc"
    )
    public List<Schedule> getList(@Param("compNo") int compNo, @Param("nowDate") String nowDate, @Param("calDate") String calDate);

    @Select("SELECT * FROM swc_sched WHERE attrib NOT LIKE 'XXX%' AND schedNo = #{schedNo} AND compNo = #{compNo}")
    public Schedule getScheduleOne(@Param("schedNo") String schedNo, @Param("compNo") int compNo);

    @Insert("INSERT INTO swc_sched (userNo, compNo, soppNo, custNo, schedFrom, schedTo, `title`, `desc`, schedType, schedPlace, `type`, regDatetime) VALUES (#{schedule.userNo}, #{schedule.compNo}, #{schedule.soppNo}, #{schedule.custNo}, #{schedule.schedFrom}, #{schedule.schedTo}, #{schedule.title}, #{schedule.desc}, '10168', #{schedule.schedPlace}, #{schedule.type}, now())")
    public int scheduleInsert(@Param("schedule") Schedule schedule);

    @Update("UPDATE swc_sched SET userNo = #{schedule.userNo}, soppNo = #{schedule.soppNo}, custNo = #{schedule.custNo}, schedFrom = #{schedule.schedFrom}, schedTo = #{schedule.schedTo}, schedPlace = #{schedule.schedPlace}, `desc` = #{schedule.desc}, `title` = #{schedule.title}, `type` = #{schedule.type}, modDatetime = now() WHERE schedNo = #{schedule.schedNo} AND compNo = #{schedule.compNo}")
    public int updateSchedule(@Param("schedule") Schedule schedule);

    @Update("UPDATE swc_sched SET attrib = 'XXXXX' WHERE schedNo = #{schedNo} AND compNo = #{compNo}")
    public int deleteSchedule(@Param("compNo") int compNo, @Param("schedNo") String schedNo);

    @Select(
        "select salesNo as `no`, compNo, custNo, userNo, schedFrom, schedTo, `title`, `desc`, salesPlace as place, schedType, `type`, salesCheck as `check`, regDatetime from swc_sales where YEARWEEK(schedFrom) = YEARWEEK(#{schedule.from}) and compNo = #{schedule.compNo} and userNo = #{schedule.userNo} and attrib not like 'XXX%'\r\n" +
        " union " + 
        "select schedNo as `no`, compNo, custNo, userNo, schedFrom, schedTo, `title`, `desc`, schedPlace as place, schedType, `type`, schedCheck as `check`, regDatetime from swc_sched where YEARWEEK(schedFrom) = YEARWEEK(#{schedule.from}) and compNo = #{schedule.compNo} and userNo = #{schedule.userNo} and attrib not like 'XXX%'\r\n" +
        " union " +
        "select techdNo as `no`, compNo, custNo, userNo, schedFrom, schedTo, `title`, `desc`, techdPlace as place, schedType, `type`, techdCheck as `check`, regDatetime from swc_techd where YEARWEEK(schedFrom) = YEARWEEK(#{schedule.from}) and compNo = #{schedule.compNo} and userNo = #{schedule.userNo} and attrib not like 'XXX%' order by schedFrom asc"
    )
    public List<Schedule> getWorkReport(@Param("schedule") Schedule schedule);

    @Select("select * from swc_sreport where userNo = #{userNo} and compNo = #{compNo} and weekNum = #{weekNum} order by regDate desc limit 1")
    public Schedule getSreport(@Param("weekNum") String weekNum, @Param("userNo") String userNo, @Param("compNo") int compNo);

    @Update("UPDATE swc_sales SET salesCheck = #{sales.check}, modDatetime = now() WHERE salesNo = #{sales.no} AND compNo = #{sales.compNo}")
    public int salesReportUpdate(@Param("sales") Sales sales);

    @Update("UPDATE swc_sched SET schedCheck = #{schedule.check}, modDatetime = now() WHERE schedNo = #{schedule.no} AND compNo = #{schedule.compNo}")
    public int scheduleReportUpdate(@Param("schedule") Schedule schedule);
    
    @Update("UPDATE swc_techd SET techdCheck = #{tech.check}, modDatetime = now() WHERE techdNo = #{tech.no} AND compNo = #{tech.compNo}")
    public int techReportUpdate(@Param("tech") Tech tech);

    @Insert("INSERT INTO swc_sreport (userNo, compNo, weekNum, prComment, prCheck, thComment, thCheck, regDate) VALUES (#{schedule.userNo}, #{schedule.compNo}, #{schedule.weekNum}, #{schedule.prComment}, #{schedule.prCheck}, #{schedule.thComment}, #{schedule.thCheck}, now())")
    public int reportOtherInsert(@Param("schedule") Schedule schedule);

    @Select("select swc_organiz.org_title, swc_user.userNo, swc_user.userName, swc_user.org_id ,max(swc_sreport.sreportNo) sreportNo, swc_sreport.weekNum from swc_user \r\n" + 
            "left join swc_sreport on swc_user.userNo = swc_sreport.userNo and swc_sreport.weekNum = #{weekNum} \r\n" + 
            "left join swc_organiz on swc_user.org_id = swc_organiz.org_id \r\n" + 
            "where swc_user.compNo = #{compNo} and swc_user.attrib not like 'XXX%' group by swc_user.userNo order by swc_user.userOtp asc")
    public List<Schedule> getWorkJournalThisUser(@Param("compNo") int compNo, @Param("weekNum") String weekNum);

    @Select("select swc_organiz.org_title, swc_user.userNo, swc_user.userName, swc_user.org_id ,max(swc_sreport.sreportNo) sreportNo, swc_sreport.weekNum from swc_user \r\n" + 
            "left join swc_sreport on swc_user.userNo = swc_sreport.userNo and swc_sreport.weekNum = #{weekNum} \r\n" + 
            "left join swc_organiz on swc_user.org_id = swc_organiz.org_id \r\n" + 
            "where swc_user.compNo = #{compNo} and swc_user.attrib not like 'XXX%' group by swc_user.userNo order by swc_user.userOtp asc")
    public List<Schedule> getWorkJournalNextUser(@Param("compNo") int compNo, @Param("weekNum") String weekNum);






    //@Select("SELECT a.* FROM (" + 
    //    "SELECT 'etc' AS job, schedno AS no, userno AS user, custno AS cust, soppno AS sopp, schedtitle AS title, scheddesc AS detail, schedfrom AS \"from\", schedto AS \"to\", schedplace AS place, regdatetime AS created, modDatetime AS modified FROM swc_sched WHERE schedfrom < DATE_ADD(#{ymd}, INTERVAL 1 MONTH) AND schedto >= #{ymd} AND compno = (SELECT compno FROM swc_company WHERE compid =#{compId}) " +
    //    "UNION ALL " +
    //    "SELECT 'sales' AS job, salesno AS no, userno AS user, custno AS cust, soppno AS sopp, salestitle AS title, salesdesc AS detail, salesfrdatetime AS \"from\", salestodatetime AS \"to\", salesplace AS place, regdatetime AS created, modDatetime AS modified FROM swc_sales WHERE salesfrdatetime < DATE_ADD(#{ymd}, INTERVAL 1 MONTH) AND salestodatetime >= #{ymd} AND compno = (SELECT compno FROM swc_company WHERE compid =#{compId}) " +
    //    "UNION ALL " +
    //    "SELECT 'tech' AS job, techdno AS no, userno AS user, custno AS cust, soppno AS sopp, techdtitle as title, techddesc as detail, techdfrom AS \"from\", techdto AS \"to\", techdplace AS place, regdatetime AS created, modDatetime AS modified FROM swc_techd WHERE techdfrom < DATE_ADD(#{ymd}, INTERVAL 1 MONTH) AND techdto >= #{ymd} AND compno = (SELECT compno FROM swc_company WHERE compid =#{compId}) " +
    //") a WHERE a.user IN (SELECT user_no FROM bizcore.user_dept WHERE dept_id IN (#{deptIn})) ORDER BY a.from, a.user, a.job")
    //public List<Schedule> getSchedule(@Param("compId") String compId, @Param("ymd") String ym, @Param("deptIn") String deptIn);

    // ↑ 일정 통합 전 기존 작업 내용
    // =================================================================================================
    // ↓ 일정 통합 후 신규 작업 내용

    // === 단일 일정 조회 ===
    @Select("SELECT 'schedule' AS job, schedNo AS no, userNo AS writer, soppNo AS sopp, custNo AS customer, schedFrom AS `from`, schedTo AS `to`, schedTitle AS title, schedDesc AS content, schedCheck AS report, schedType AS type, schedPlace AS place, regdatetime AS created, moddatetime AS modified FROM swc_sched WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND schedno = #{no}")
    public Schedule getScheduleFromSched(@Param("compId") String compId, @Param("no") String no);

    @Select("SELECT  'sales' AS job, salesNo AS no, userNo AS writer, soppNo AS sopp, ptncNo AS customer, salesFrdatetime AS `from`, salesTodatetime AS `to`, salesTitle AS title, salesDesc AS content, salesCheck AS report, salesType AS type, salesPlace AS place, custNo AS partner, regdatetime AS created, moddatetime AS modified FROM swc_sales WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND salesno = #{no}")
    public Schedule getScheduleFromSales(@Param("compId") String compId, @Param("no") String no);

    @Select("SELECT 'tech' AS job, techdNo AS no, userNo AS writer, soppNo AS sopp, IF(endCustNo=100002,NULL,endCustNo) AS customer, techdFrom AS `from`, techdTo AS `to`, techdTitle AS title, techdDesc AS content, techdCheck AS report, IF(techdType='',NULL,techdType) AS type, techdPlace AS place, custNo AS partner, contNo AS contract, cntrctMth AS contractMethod, custmemberNo AS cipOfCustomer, techdItemmodel AS supportModel, techdItemversion AS supportVersion, techdSteps AS supportStep, regdatetime AS created, moddatetime AS modified FROM swc_techd WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND techdno = #{no}")
    public Schedule getScheduleFromTechd(@Param("compId") String compId, @Param("no") String no);

    // === 일정 목록 조회 ===
    @Select("SELECT 'schedule' AS job, schedNo AS no, userNo AS writer, soppNo AS sopp, custNo AS customer, schedFrom AS `from`, schedTo AS `to`, schedTitle AS title, schedDesc AS content, schedCheck AS report, schedType AS type, schedPlace AS place, regdatetime AS created, moddatetime AS modified FROM swc_sched WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND #{start} <= schedto AND #{end} > schedFrom ORDER BY schedno DESC")
    public List<Schedule> getScheduleListFromSched(@Param("compId") String compId, @Param("start") Date start, @Param("end") Date end);

    @Select("SELECT 'sales' AS job, salesNo AS no, userNo AS writer, soppNo AS sopp, ptncNo AS customer, salesFrdatetime AS `from`, salesTodatetime AS `to`, salesTitle AS title, salesDesc AS content, salesCheck AS report, salesType AS type, salesPlace AS place, custNo AS partner, regdatetime AS created, moddatetime AS modified FROM swc_sales WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND #{start} <= salestodatetime AND #{end} > salesfrdatetime ORDER BY salesno DESC")
    public List<Schedule> getScheduleListFromSales(@Param("compId") String compId, @Param("start") Date start, @Param("end") Date end);

    @Select("SELECT 'tech' AS job, techdNo AS no, userNo AS writer, soppNo AS sopp, IF(endCustNo=100002,NULL,endCustNo) AS customer, techdFrom AS `from`, techdTo AS `to`, techdTitle AS title, techdDesc AS content, techdCheck AS report, IF(techdType='',NULL,techdType) AS type, techdPlace AS place, custNo AS partner, contNo AS contract, cntrctMth AS contractMethod, custmemberNo AS cipOfCustomer, techdItemmodel AS supportModel, techdItemversion AS supportVersion, techdSteps AS supportStep, regdatetime AS created, moddatetime AS modified FROM swc_techd WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND #{start} <= techdto AND #{end} > techdfrom ORDER BY techdno DESC")
    public List<Schedule> getScheduleListFromTechd(@Param("compId") String compId, @Param("start") Date start, @Param("end") Date end);

    // === 부서기준 일정 조회 ===
    @Select("SELECT 'schedule' AS job, schedNo AS no, userNo AS writer, soppNo AS sopp, custNo AS customer, schedFrom AS `from`, schedTo AS `to`, schedTitle AS title, schedDesc AS content, schedCheck AS report, schedType AS type, schedPlace AS place, regdatetime AS created, moddatetime AS modified FROM swc_sched WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND #{start} <= schedto AND #{end} > schedFrom AND userno IN (SELECT user_no FROM bizcore.user_dept WHERE dept_id IN (#{deptIn}) AND comp_id = #{compId}) ORDER BY schedno DESC")
    public List<Schedule> getScheduleListFromSchedWithDept(@Param("compId") String compId, @Param("start") Date start, @Param("end") Date end, @Param("deptIn") String deptIn);

    @Select("SELECT 'sales' AS job, salesNo AS no, userNo AS writer, soppNo AS sopp, ptncNo AS customer, salesFrdatetime AS `from`, salesTodatetime AS `to`, salesTitle AS title, salesDesc AS content, salesCheck AS report, salesType AS type, salesPlace AS place, custNo AS partner, regdatetime AS created, moddatetime AS modified FROM swc_sales WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND #{start} <= salestodatetime AND #{end} > salesfrdatetime AND userno IN (SELECT user_no FROM bizcore.user_dept WHERE dept_id IN (#{deptIn}) AND comp_id = #{compId}) ORDER BY salesno DESC")
    public List<Schedule> getScheduleListFromSalesWithDept(@Param("compId") String compId, @Param("start") Date start, @Param("end") Date end, @Param("deptIn") String deptIn);

    @Select("SELECT 'tech' AS job, techdNo AS no, userNo AS writer, soppNo AS sopp, IF(endCustNo=100002,NULL,endCustNo) AS customer, techdFrom AS `from`, techdTo AS `to`, techdTitle AS title, techdDesc AS content, techdCheck AS report, IF(techdType='',NULL,techdType) AS type, techdPlace AS place, custNo AS partner, contNo AS contract, cntrctMth AS contractMethod, custmemberNo AS cipOfCustomer, techdItemmodel AS supportModel, techdItemversion AS supportVersion, techdSteps AS supportStep, regdatetime AS created, moddatetime AS modified FROM swc_techd WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND #{start} <= techdto AND #{end} > techdfrom AND userno IN (SELECT user_no FROM bizcore.user_dept WHERE dept_id IN (#{deptIn}) AND comp_id = #{compId}) ORDER BY techdno DESC")
    public List<Schedule> getScheduleListFromTechdWithDept(@Param("compId") String compId, @Param("start") Date start, @Param("end") Date end, @Param("deptIn") String deptIn);

    // === 사용자 기준 일정 조회 ===
    @Select("SELECT 'schedule' AS job, schedNo AS no, userNo AS writer, soppNo AS sopp, custNo AS customer, schedFrom AS `from`, schedTo AS `to`, schedTitle AS title, schedDesc AS content, schedCheck AS report, schedType AS type, schedPlace AS place, regdatetime AS created, moddatetime AS modified FROM swc_sched WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND #{start} <= schedto AND #{end} > schedFrom AND userno = #{userNo} ORDER BY schedno DESC")
    public List<Schedule> getScheduleListFromSchedWithUser(@Param("compId") String compId, @Param("start") Date start, @Param("end") Date end, @Param("userNo") String userNo);

    @Select("SELECT 'sales' AS job, salesNo AS no, userNo AS writer, soppNo AS sopp, ptncNo AS customer, salesFrdatetime AS `from`, salesTodatetime AS `to`, salesTitle AS title, salesDesc AS content, salesCheck AS report, salesType AS type, salesPlace AS place, custNo AS partner, regdatetime AS created, moddatetime AS modified FROM swc_sales WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND #{start} <= salestodatetime AND #{end} > salesfrdatetime AND userno = #{userNo} ORDER BY salesno DESC")
    public List<Schedule> getScheduleListFromSalesWithUser(@Param("compId") String compId, @Param("start") Date start, @Param("end") Date end, @Param("userNo") String userNo);

    @Select("SELECT 'tech' AS job, techdNo AS no, userNo AS writer, soppNo AS sopp, IF(endCustNo=100002,NULL,endCustNo) AS customer, techdFrom AS `from`, techdTo AS `to`, techdTitle AS title, techdDesc AS content, techdCheck AS report, IF(techdType='',NULL,techdType) AS type, techdPlace AS place, custNo AS partner, contNo AS contract, cntrctMth AS contractMethod, custmemberNo AS cipOfCustomer, techdItemmodel AS supportModel, techdItemversion AS supportVersion, techdSteps AS supportStep, regdatetime AS created, moddatetime AS modified FROM swc_techd WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND #{start} <= techdto AND #{end} > techdfrom AND userno = #{userNo} ORDER BY techdno DESC")
    public List<Schedule> getScheduleListFromTechdWithUser(@Param("compId") String compId, @Param("start") Date start, @Param("end") Date end, @Param("userNo") String userNo);

    // === SOPP 기준 일정 조회 ===
    @Select("SELECT 'schedule' AS job, schedNo AS no, userNo AS writer, soppNo AS sopp, custNo AS customer, schedFrom AS `from`, schedTo AS `to`, schedTitle AS title, schedDesc AS content, schedCheck AS report, schedType AS type, schedPlace AS place, regdatetime AS created, moddatetime AS modified FROM swc_sched WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND soppno = #{soppNo} ORDER BY schedno DESC")
    public List<Schedule> getScheduleListFromSchedWithSopp(@Param("compId") String compId, @Param("soppNo") String soppNo);

    @Select("SELECT 'sales' AS job, salesNo AS no, userNo AS writer, soppNo AS sopp, ptncNo AS customer, salesFrdatetime AS `from`, salesTodatetime AS `to`, salesTitle AS title, salesDesc AS content, salesCheck AS report, salesType AS type, salesPlace AS place, custNo AS partner, regdatetime AS created, moddatetime AS modified FROM swc_sales WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND soppno = #{soppNo} ORDER BY salesno DESC")
    public List<Schedule> getScheduleListFromSalesWithSopp(@Param("compId") String compId, @Param("soppNo") String soppNo);

    @Select("SELECT 'tech' AS job, techdNo AS no, userNo AS writer, soppNo AS sopp, IF(endCustNo=100002,NULL,endCustNo) AS customer, techdFrom AS `from`, techdTo AS `to`, techdTitle AS title, techdDesc AS content, techdCheck AS report, IF(techdType='',NULL,techdType) AS type, techdPlace AS place, custNo AS partner, contNo AS contract, cntrctMth AS contractMethod, custmemberNo AS cipOfCustomer, techdItemmodel AS supportModel, techdItemversion AS supportVersion, techdSteps AS supportStep, regdatetime AS created, moddatetime AS modified FROM swc_techd WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND soppno = #{soppNo} ORDER BY techdno DESC")
    public List<Schedule> getScheduleListFromTechdWithsopp(@Param("compId") String compId, @Param("soppNo") String soppNo);

    // === 계약 기준 일정 조회 ===
    @Select("SELECT 'schedule' AS job, schedNo AS no, userNo AS writer, soppNo AS sopp, custNo AS customer, schedFrom AS `from`, schedTo AS `to`, schedTitle AS title, schedDesc AS content, schedCheck AS report, schedType AS type, schedPlace AS place, regdatetime AS created, moddatetime AS modified FROM swc_sched WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND contno = #{contNo} ORDER BY schedno DESC")
    public List<Schedule> getScheduleListFromSchedWithContrct(@Param("compId") String compId, @Param("contNo") int soppNo);

    @Select("SELECT 'tech' AS job, techdNo AS no, userNo AS writer, soppNo AS sopp, IF(endCustNo=100002,NULL,endCustNo) AS customer, techdFrom AS `from`, techdTo AS `to`, techdTitle AS title, techdDesc AS content, techdCheck AS report, IF(techdType='',NULL,techdType) AS type, techdPlace AS place, custNo AS partner, contNo AS contract, cntrctMth AS contractMethod, custmemberNo AS cipOfCustomer, techdItemmodel AS supportModel, techdItemversion AS supportVersion, techdSteps AS supportStep, regdatetime AS created, moddatetime AS modified FROM swc_techd WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND contno = #{contNo} ORDER BY techdno DESC")
    public List<Schedule> getScheduleListFromTechdWithContrct(@Param("compId") String compId, @Param("contNo") int soppNo);

    // 일정삭제
    @Update("UPDATE swc_sched SET attrib = 'XXXXX' WHERE compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND schedno = #{no}")
    public int deleteSched(@Param("compId") String compId, @Param("no") String no);

    @Update("UPDATE swc_sales SET attrib = 'XXXXX' WHERE compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND salesno = #{no}")
    public int deleteSales(@Param("compId") String compId, @Param("no") String no);

    @Update("UPDATE swc_techd SET attrib = 'XXXXX' WHERE compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND techdno = #{no}")
    public int deleteTechd(@Param("compId") String compId, @Param("no") String no);

    @Select("SELECT a.userno AS writer, a.prcheck AS previousWeekCheck ,a.prcomment AS previousWeek, a.thcheck AS currentWeekCheck, a.thcomment AS currentWeek " +
            "FROM swc_sreport a, " +
            "(SELECT MAX(sreportno) no, userno FROM swc_sreport WHERE weeknum = #{week} GROUP BY userno) b " +
            "WHERE a.attrib = 11111 AND a.userno = b.userno AND a.sreportno = b.no AND a.compno = (SELECT compno FROM swc_company WHERE compid = #{compId})")
    public List<WorkReport> getWorkReportsCompany(@Param("compId") String compId, @Param("week") int week);

    @Select("SELECT a.userno AS writer, a.prcheck AS previousWeekCheck ,a.prcomment AS previousWeek, a.thcheck AS currentWeekCheck, a.thcomment AS currentWeek " +
            "FROM swc_sreport a, " +
            "(SELECT MAX(sreportno) no, userno FROM swc_sreport WHERE weeknum = #{week} GROUP BY userno) b " +
            "WHERE a.attrib = 11111 AND a.userno = b.userno AND a.sreportno = b.no AND a.compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND a.userno IN (SELECT user_no FROM bizcore.user_dept WHERE dept_id IN (#{deptIn}))")
    public List<WorkReport> getWorkReportsDept(@Param("compId") String compId, @Param("week") int week, @Param("deptIn") String deptIn);

    @Select("SELECT a.userno AS writer, a.prcheck AS previousWeekCheck, a.prcomment AS previousWeek, a.thcheck AS currentWeekCheck, a.thcomment AS currentWeek " +
            "FROM swc_sreport a, " +
            "(SELECT MAX(sreportno) no, userno FROM swc_sreport WHERE weeknum = #{week} GROUP BY userno) b " +
            "WHERE a.attrib = 11111 AND a.userno = b.userno AND a.sreportno = b.no AND a.compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND a.userno = #{userNo}")
    public WorkReport getWorkReportPersonal(@Param("compId") String compId, @Param("week") int week, @Param("userNo") String userNo);

    @Select("SELECT 'schedule' AS job, schedNo AS no, userNo AS writer, soppNo AS sopp, custNo AS customer, schedFrom AS `from`, schedTo AS `to`, schedTitle AS title, schedDesc AS content, schedCheck AS report, schedType AS type, schedPlace AS place, 0 AS partner, regdatetime AS created, moddatetime AS modified FROM swc_sched WHERE attrib NOT LIKE 'XXX%' AND userno = #{writer} AND schedfrom < #{end} AND schedto >= #{start} AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) " +
                "UNION ALL " + 
                "SELECT 'sales' AS job, salesNo AS no, userNo AS writer, soppNo AS sopp, ptncNo AS customer, salesFrdatetime AS `from`, salesTodatetime AS `to`, salesTitle AS title, salesDesc AS content, salesCheck AS report, salesType AS type, salesPlace AS place, custNo AS partner, regdatetime AS created, moddatetime AS modified FROM swc_sales WHERE attrib NOT LIKE 'XXX%' AND userno = #{writer} AND salesfrdatetime < #{end} AND salestodatetime >= #{start} AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) " +
                "UNION ALL " + 
                "SELECT 'tech' AS job, techdNo AS no, userNo AS writer, soppNo AS sopp, IF(endCustNo=100002,NULL,endCustNo) AS customer, techdFrom AS `from`, techdTo AS `to`, techdTitle AS title, techdDesc AS content, techdCheck AS report, IF(techdType='',NULL,techdType) AS type, techdPlace AS place, custNo AS partner, regdatetime AS created, moddatetime AS modified FROM swc_techd WHERE attrib NOT LIKE 'XXX%' AND userno = #{writer} AND techdfrom < #{end} AND techdto >= #{start} AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId})")
    public List<Schedule3> getScheduleListForReport(@Param("compId") String compId, @Param("start") Date start, @Param("end") Date end, @Param("writer") int writer);

    @Update("UPDATE swc_sreport SET attrib = 'XXXXX' WHERE userno = #{userNo} AND weeknum = #{week} AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId})")
    public int deleteWorkReport(@Param("compId") String compId, @Param("userNo") String userNo, @Param("week") int week);

    @Update("UPDATE swc_sched SET schedcheck = #{check} WHERE schedno = #{no} AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND userno = #{userNo}")
    public int setWorkReportCheckStatusForSched(@Param("compId") String compId, @Param("no") String no, @Param("userNo") String userNo, @Param("check") int check);

    @Update("UPDATE swc_sales SET salescheck = #{check} WHERE salesno = #{no} AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND userno = #{userNo}")
    public int setWorkReportCheckStatusForSales(@Param("compId") String compId, @Param("no") String no, @Param("userNo") String userNo, @Param("check") int check);

    @Update("UPDATE swc_techd SET techdcheck = #{check} WHERE techdno = #{no} AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND userno = #{userNo}")
    public int setWorkReportCheckStatusForTechd(@Param("compId") String compId, @Param("no") String no, @Param("userNo") String userNo, @Param("check") int check);

    
}
