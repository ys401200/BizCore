package kr.co.bizcore.v1.mapper;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

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

    @Select("SELECT savedName FROM bizcore.attached WHERE compId = #{compId} AND funcname = #{funcName} AND funcno = #{funcNo} AND filename = #{fileName} AND deleted IS NULL")
    public String getAttachedFileName(@Param("compId") String compId, @Param("funcName") String funcName, @Param("funcNo") int funcNo, @Param("fileName") String fileName);

    @Update("UPDATE bizcore.attached SET deleted=NOW() WHERE compid=#{compId} AND funcname=#{funcName} AND funcno=#{funcNo} AND filename=#{fileName}")
    public int deleteAttachedFile(@Param("compId") String compId, @Param("funcName") String funcName, @Param("funcNo") int funcNo, @Param("fileName") String fileName);

    @Insert("INSERT INTO bizcore.attached(compId,funcName,funcNo,fileName,savedName,`size`) VALUES(#{compId},#{funcName},#{funcNo},#{fileName},#{savedName},#{size})")
    public int setAttachedFileData(@Param("compId") String compId,@Param("funcName") String funcName, @Param("funcNo") int funcNo, @Param("fileName") String fileName, @Param("savedName") String savedName, @Param("size") long size);

    //@Select("SELECT fileName, CAST(`size` AS CHAR) AS `size` FROM bizcore.attached WHERE compId = #{compId} AND funcName = #{funcName} AND funcNo = #{funcNo} AND deleted IS NULL")
    //public List<HashMap<String, String>> getAttachedFileInfo(@Param("compId") String compId,@Param("funcName") String funcName, @Param("funcNo") int funcNo);

    @Select("SELECT fileName, CAST(size as CHAR) AS size, cast(removed AS char) AS removed FROM bizcore.attached WHERE compid = #{compId} AND funcName = #{funcName} AND funcNo = #{no} AND deleted IS NULL")
    public List<HashMap<String, String>> getAttachedFileList(@Param("compId") String compId, @Param("funcName") String funcName, @Param("no") int no);

    // 회사 고유의 aes 키 값을 가져오는 매퍼
    @Select("SELECT aesKey, aesIv FROM bizsys.company_aes WHERE compId=#{compId}")
    public HashMap<String, String> getCompanyAesKey(@Param("compId") String compId);

    // 로그인 상태 유지를 확인하는 메서드
    @Select("SELECT userNo FROM bizcore.keep_login WHERE compId = #{compId} AND keepToken = #{keepToken} AND expire > #{now}")
    public String verifyLoginKeepToken(@Param("compId") String compId, @Param("keepToken") String keepToken, @Param("now") long now);

    // 로그인 상태 유지 정보를 업데이트하는 메서드
    @Update("UPDATE bizcore.keep_login SET expire = #{expire} WHERE compId = #{compId} AND keepToken = #{keepToken} AND userNo > #{userNo}")
    public String extendLoginKeepToken(@Param("compId") String compId, @Param("userNo") String userNo, @Param("keepToken") String keepToken, @Param("expire") long expire);

    // 로그인 유지 토큰을 저장하는 메서드
    @Insert("INSERT INTO bizcore.keep_login(compId, userNo, keepToken, expire) VALUES(#{compId}, #{userNo}, #{keepToken}, #{expire})")
    public void setKeepToken(@Param("compId") String compId, @Param("keepToken") String keepToken, @Param("userNo") String userNo, @Param("expire") long expire);

    // 해당사용자의 로그인 유지 정보를 삭제하는 메서드
    @Delete("DELETE FROM bizcore.keep_login WHERE compId = #{compId} AND userNo = #{userNo}")
    public void deleteKeepTokenByUser(@Param("compId") String compId, @Param("userNo") String userNo);

    // 만료된 로그인 유지 정보를 삭제하는 메서드
    @Delete("DELETE FROM bizcore.keep_login WHERE expire < #{expire}")
    public void deleteKeepToken(@Param("expire") long expire);

    // 첨부된 파일명을 받아오는 메서드
    @Select("SELECT fileName FROM bizcore.attached WHERE compId = #{compId} AND funcName = #{funcName} AND funcNo = #{funcNo}")
    public List<String> getAttachedList(@Param("compId") String compId, @Param("funcName") String funcName, @Param("funcNo") int no);

    // 부서코드 기준 부서명 가져오기
    @Select("SELECT org_title FROM swcore.swc_organiz WHERE org_code = #{deptId} AND compNo = (SELECT compno FROM swc_company WHERE compid = #{compId})")
    public String getDeptName(@Param("compId") String compId, @Param("deptId") String deptId);

    // 직원 성별을 가져오는 메서드 / 디폴트 아바타 설별 구분용
    @Select("SELECT gender FROM bizcore.users WHERE compId = #{compId} AND `no` = #{empNo}")
    public Integer getEmployeeGender(@Param("compId") String compId, @Param("empNo") String empNo);

    // 퇴사일이 기록되어 있고 경과한 사람에 대한 퇴사 처리
    @Update("UPDATE bizcore.users SET deleted = NOW(), prohibited = 1 WHERE DATE_ADD(NOW(), INTERVAL 9 HOUR) > resigned AND deleted IS NULL")
    public int processResignedEmployee();

    // 직원의 전사 권한 조회
    @Select("SELECT func_id f, CAST(permission AS CHAR) p FROM bizcore.permission WHERE dept = 'all' AND comp_id = #{compId} AND user_no = #{employee}")
    public List<HashMap<String, String>> getEmployeeCompPermission(@Param("compId") String compId, @Param("employee") String employee);

    // 직원의 부서 권한 조회
    @Select("SELECT d.dept_id dept, p.func_id " +
            "FROM bizcore.user_dept d " +
            "LEFT JOIN bizcore.permission p " + 
            "ON (d.dept_id = p.dept AND p.comp_id = #{compId} AND p.user_no = #{employee} AND p.permission = 1) " + 
            "WHERE d.comp_id = #{compId} AND d.user_no = #{employee}")
    public List<HashMap<String, String>> getEmployeeDeptPermission(@Param("compId") String compId, @Param("employee") String employee);

}
