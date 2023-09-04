package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.Store;

public interface StoreMapper {
    @Select("SELECT * FROM swc_techstore WHERE attrib NOT LIKE 'XXX%' AND compNo = #{store.compNo}")
    public List<Store> getStoreList(@Param("store") Store store);
}
