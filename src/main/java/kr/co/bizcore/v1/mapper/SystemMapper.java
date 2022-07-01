package kr.co.bizcore.v1.mapper;

import java.util.List;
import java.util.Map;

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

    // 濡쒓렇�씤 �썑 沅뚯븣�쓣 媛��졇�삤�뒗 荑쇰━
    @Select("SELECT func_id as funcId, sub_id AS subId, permission FROM bizcore.permission WHERE comp_id = #(compId) AND user_no = #(userNo) AND dept = #{dept} AND func_id IN (SELECT 'A' UNION ALL SELECT func_id FROM bizsys.comp_permission WHERE comp_id = #{compId} AND permission = 1)")
    public List<Map<String, String>> getUserPermission(String compId, String dept, int userNo);

}
