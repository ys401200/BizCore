package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.Product;

public interface ProductMapper {
    
    @Select("SELECT compId, no, categoryName, vendor, writer, name, `desc`, price, image, created, modified FROM bizcore.product WHERE compId = (SELECT compId FROM swcore2.swc_company WHERE compId = #{compId})")
    public List<Product> getProductList(@Param("compId") String compId);

    @Select("SELECT compId, no, categoryName, vendor, writer, name, `desc`, price, image, created, modified FROM bizcore.swc_product WHERE compId = (SELECT compId FROM swcore2.swc_company WHERE compId = #{compId}) LIMIT #{start}, #{end}")
    public List<Product> getProductListWithStartAndEnd(@Param("compId") String compId, @Param("start") int start, @Param("end") int end);

    @Select("SELECT count(*) FROM swc_product WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId})")
    public int getProductCount(@Param("compId") String compId);

    @Select("SELECT compId, no, categoryName, vendor, writer, name, `desc`, price, image, created, modified FROM bizcore.product WHERE no = #{no} AND compId = (SELECT compId FROM swcore2.swc_company WHERE compId = #{compId})")
    public Product getProduct(@Param("compId") String compId, @Param("no") int no);

    @Select("UPDATE swc_product SET attrib = 'XXXXX' WHERE productno = #{prodNo} AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId})")
    public int removeProduct(@Param("compId") String compId, @Param("prodNo") int no);
}
