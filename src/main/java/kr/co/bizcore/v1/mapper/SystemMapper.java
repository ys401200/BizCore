package kr.co.bizcore.v1.mapper;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.ConnUrl;

public interface SystemMapper {

    // for TEST
    @Select("SELECT now()")
    public String test();

    // 접속주소 기반 compId를 판단하기 위한 장보를 가져옴
    @Select("SELECT connAddr, compId FROM bizsys.company_url")
    public List<ConnUrl> getConnUrl();

    // 로그인 검증
    @Select("SELECT userno FROM swc_user WHERE compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) AND userid = #{userId} AND userpasswd  = password(#{pw})")
    public String verifyLogin(@Param("compId") String compId, @Param("userId") String userId, @Param("pw") String pw);

    @Select("SELECT UNIX_TIMESTAMP(NOW())")
    public long getCurrentTimeFromDB();

    @Select("SELECT WEEK(NOW())")
    public int getCurrentWeek();

    @Select("SELECT WEEK(#{date})")
    public int getWeek(Date date);

    @Select("SELECT WEEK(#{date})")
    public int getWeekStr(String date);

    @Select("SELECT name FROM bizsys.directories")
    public List<String> getDirectoryNames();

}
