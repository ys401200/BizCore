package kr.co.bizcore.v1.mapper;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Insert;
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

    @Select("SELECT savedName FROM bizcore.attached WHERE compId = #{compId} AND funcname = #{funcName} AND funcno = #{no} AND filename = #{fileName} AND removed = 0 AND deleted IS NULL")
    public String getAttachedFileName(@Param("compId") String compId, @Param("funcName") String funcName, @Param("funcNo") int funcNo, @Param("fileName") String fileName);

    @Insert("INSERT INTO bizcore.attached(compId,funcName,funcNo,fileName,savedName,`size`) VALUES(#{compId},#{funcName},#{funcNo},#{fileName},#{savedName},#{size})")
    public int setAttachedFileData(@Param("compId") String compId,@Param("funcName") String funcName, @Param("funcNo") int funcNo, @Param("fileName") String fileName, @Param("savedName") String savedName, long size);

    @Select("SELECT fileName, CAST(`size` AS CHAR) AS `size` FROM bizcore.attached WHERE compId = #{compId} AND funcName = #{funcName} AND funcNo = #{funcNo} AND deleted IS NULL")
    public List<HashMap<String, String>> getAttachedFileInfo(@Param("compId") String compId,@Param("funcName") String funcName, @Param("funcNo") int funcNo);

    @Select("SELECT fileName, CAST(size as CHAR) AS size, cast(removed AS char) AS removed FROM bizcore.attached WHERE compid = #{compId} AND funcName = #{funcName} AND funcNo = #{no} AND deleted IS NULL")
    public List<HashMap<String, String>> getAttachedFileList(@Param("compId") String compId, @Param("funcName") String funcName, @Param("no") int no);
}
