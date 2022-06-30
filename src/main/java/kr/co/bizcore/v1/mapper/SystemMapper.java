package kr.co.bizcore.v1.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.ConnUrl;

public interface SystemMapper {

    // for TEST
    @Select("SELECT now()")
    public String test();

    // 접속주소 기반, compId를 확인하기 위한 쿼리
    @Select("SELECT conn_addr AS connAddr, comp_id AS compId FROM bizsys.company_url")
    public List<ConnUrl> getConnUrl();

    // 로그인 검증 쿼리
    @Select("SELECT userno FROM swcore.swc_user WHERE compno = (SELECT compno FROM swcore.swc_company WHERE compid = #{compId}) AND userid = #{userId} AND userpasswd  = password(#{pw})")
    public String verifyLogin(@Param("compId") String compId, @Param("userId") String userId, @Param("pw") String pw);

}
