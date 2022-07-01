package kr.co.bizcore.v1.mapper;

import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.User;

public interface UserMapper {

    @Select("SELECT a.userno AS userNo, (SELECT compid FROM swcore.swc_company c WHERE c.compno = a.compno) AS compId, a.userid AS userId, a.userName AS userName, b.org_code AS deptId from swcore.swc_user a, swcore.swc_organiz b where a.org_id = b.org_id and userno = #{userNo}")
    public User getBasicUserInfo(String userNo);
}
