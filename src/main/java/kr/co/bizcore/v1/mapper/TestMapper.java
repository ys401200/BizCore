package kr.co.bizcore.v1.mapper;

import java.util.Date;

import org.apache.ibatis.annotations.Select;

public interface TestMapper {

    @Select("SELECT NOW()")
    public Date test();
    
}
