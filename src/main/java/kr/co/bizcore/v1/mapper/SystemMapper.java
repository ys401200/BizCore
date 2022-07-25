package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.ConnUrl;

public interface SystemMapper {

    // for TEST
    @Select("SELECT now()")
    public String test();

    // �젒�냽二쇱냼 湲곕컲, compId瑜� �솗�씤�븯湲� �쐞�븳 荑쇰━
    @Select("SELECT conn_addr AS connAddr, comp_id AS compId FROM bizsys.company_url")
    public List<ConnUrl> getConnUrl();

    // 濡쒓렇�씤 寃�利� 荑쇰━
    @Select("SELECT userno FROM swcore.swc_user WHERE compno = (SELECT compno FROM swcore.swc_company WHERE compid = #{compId}) AND userid = #{userId} AND userpasswd  = password(#{pw})")
    public String verifyLogin(@Param("compId") String compId, @Param("userId") String userId, @Param("pw") String pw);

    @Select("SELECT UNIX_TIMESTAMP(NOW())")
    public long getCurrentTimeFromDB();

}
