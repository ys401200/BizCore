package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.Cust;

public interface CustMapper {
    @Select("SELECT * FROM swc_cust WHERE compNo = #{cust.compNo}")
    public List<Cust> getCustList(@Param("cust") Cust cust);
}
