package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.Store;

public interface StoreMapper {
    @Select("SELECT * FROM swc_techstore WHERE attrib NOT LIKE 'XXX%' AND compNo = #{store.compNo}")
    public List<Store> getStoreList(@Param("store") Store store);

    @Select("SELECT * FROM swc_techstore WHERE attrib NOT LIKE 'XXX%' AND storeNo = #{storeNo} AND compNo = #{compNo}")
    public Store getStore(@Param("storeNo") String storeNo, @Param("compNo") int compNo);

    @Insert("INSERT INTO swc_techstore (storeType, productNo, compNo, contNo, custNo, userNo, locationName, firstDetail, inventoryQty, purchaseNet, serial, authCode, options, secondDetail, storeDate, releaseDate, orderDate, bklnDate, regDate) VALUES (#{store.storeType}, #{store.productNo}, #{store.compNo}, #{store.contNo}, #{store.custNo}, #{store.userNo}, #{store.locationName}, #{store.firstDetail}, #{store.inventoryQty}, #{store.purchaseNet}, #{store.serial}, #{store.authCode}, #{store.options}, #{store.secondDetail}, #{store.storeDate}, #{store.releaseDate}, #{store.orderDate}, #{store.bklnDate}, now())")
    public int storeInsert(@Param("store") Store store);

    @Update("UPDATE swc_techstore SET attrib = 'XXXXX' WHERE storeNo = #{storeNo} AND compNo = #{compNo}")
    public int storeDelete(@Param("compNo") int compNo, @Param("storeNo") String storeNo);

    @Update("UPDATE swc_techstore SET storeType = #{store.storeType}, productNo = #{store.productNo}, contNo = #{store.contNo}, custNo = #{store.custNo}, userNo = #{store.userNo}, locationName = #{store.locationName}, firstDetail = #{store.firstDetail}, inventoryQty = #{store.inventoryQty}, purchaseNet = #{store.purchaseNet}, serial = #{store.serial}, authCode = #{store.authCode}, options = #{store.options}, secondDetail = #{store.secondDetail}, storeDate = #{store.storeDate}, releaseDate = #{store.releaseDate}, orderDate = #{store.orderDate}, bklnDate = #{store.bklnDate}, modDate = now() WHERE storeNo = #{store.storeNo} AND compNo = #{store.compNo}")
    public int updateStore(@Param("store") Store store);
}
