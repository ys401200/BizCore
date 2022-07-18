package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.Schedule;

public interface ScheduleMapper {
    

    @Select("SELECT a.* FROM (" + 
        "SELECT 'etc' AS job, schedno AS no, userno AS user, custno AS cust, soppno AS sopp, schedtitle AS title, scheddesc AS detail, schedfrom AS \"from\", schedto AS \"to\", schedplace AS place, regdatetime AS created, modDatetime AS modified FROM swcore.swc_sched WHERE schedfrom < DATE_ADD(#{ymd}, INTERVAL 1 MONTH) AND schedto >= #{ymd} AND compno = (SELECT compno FROM swcore.swc_company WHERE compid =#{compId}) " +
        "UNION ALL " +
        "SELECT 'sales' AS job, salesno AS no, userno AS user, custno AS cust, soppno AS sopp, salestitle AS title, salesdesc AS detail, salesfrdatetime AS \"from\", salestodatetime AS \"to\", salesplace AS place, regdatetime AS created, modDatetime AS modified FROM swcore.swc_sales WHERE salesfrdatetime < DATE_ADD(#{ymd}, INTERVAL 1 MONTH) AND salestodatetime >= #{ymd} AND compno = (SELECT compno FROM swcore.swc_company WHERE compid =#{compId}) " +
        "UNION ALL " +
        "SELECT 'tech' AS job, techdno AS no, userno AS user, custno AS cust, soppno AS sopp, techdtitle as title, techddesc as detail, techdfrom AS \"from\", techdto AS \"to\", techdplace AS place, regdatetime AS created, modDatetime AS modified FROM swcore.swc_techd WHERE techdfrom < DATE_ADD(#{ymd}, INTERVAL 1 MONTH) AND techdto >= #{ymd} AND compno = (SELECT compno FROM swcore.swc_company WHERE compid =#{compId}) " +
    ") a WHERE a.user IN (SELECT user_no FROM bizcore.user_dept WHERE dept_id IN (#{deptIn})) ORDER BY a.from, a.user, a.job")
    public List<Schedule> getSchedule(@Param("compId") String compId, @Param("ymd") String ym, @Param("deptIn") String deptIn);
}
