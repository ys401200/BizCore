package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.Product;

public interface ProductMapper {
    
    @Select("SELECT compId, no, categoryName, vendor, writer, name, `desc`, price, image, created, modified FROM bizcore.product WHERE deleted IS NULL AND compId = #{compId}")
    public List<Product> getProductList(@Param("compId") String compId);

    @Select("SELECT compId, no, categoryName, vendor, writer, name, `desc`, price, image, created, modified FROM bizcore.swc_product WHERE compId = (SELECT compId FROM swcore2.swc_company WHERE compId = #{compId}) LIMIT #{start}, #{end}")
    public List<Product> getProductListWithStartAndEnd(@Param("compId") String compId, @Param("start") int start, @Param("end") int end);

    @Select("SELECT count(*) FROM swc_product WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId})")
    public int getProductCount(@Param("compId") String compId);

    @Select("SELECT compId, no, categoryName, vendor, writer, name, `desc`, price, image, created, modified FROM bizcore.product WHERE no = #{no} AND compId = (SELECT compId FROM swcore2.swc_company WHERE compId = #{compId})")
    public Product getProduct(@Param("compId") String compId, @Param("no") int no);

    @Update("UPDATE bizcore.product SET deleted = now() WHERE deleted IS NULL AND no = #{no} AND compId = (SELECT compId FROM swc_company WHERE compId = #{compId})")
    public int removeProduct(@Param("compId") String compId, @Param("no") int no);
}
