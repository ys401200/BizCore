package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.ConnUrl;

public interface SystemMapper {

    @Select("SELECT now()")
    public String test();

    @Select("select conn_addr, comp_id from bizsys.company_url")
    public List<ConnUrl> getConnUrl();
}
