package kr.co.bizcore.v1.mapper;

import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.User;

public interface UserMapper {

    @Select("SELECT userno AS userNo, compno AS compId, userid AS userId, userName AS userName, org_id AS deptId FROM swcore.swc_user WHERE userno = #{userNo}")
    public User getBasicUserInfo(String userNo);

}
