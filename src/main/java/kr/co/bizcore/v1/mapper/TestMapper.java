package kr.co.bizcore.v1.mapper;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Select;

public interface TestMapper {

    @Select("SELECT NOW()")
    public Date test();

    // 모든 조달 정보를 json으로 만들기 위한 메서드
    @Select("SELECT id,customerCode,customerName,area,`type`,reqNo,itemCode,item,price,qty,unit,amount,title,modQty,modAmount,contractDate,deliveryPlace,sopp,created,modified FROM bizcore.procure WHERE deleted IS NULL AND compid = 'vtek'")
    public List<HashMap<String, Object>> getProcureInfo();
    
}
