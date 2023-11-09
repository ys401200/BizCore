package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.Cust;
import kr.co.bizcore.v1.domain.Product;
import kr.co.bizcore.v1.domain.Sopp;

public interface ProductMapper {
    
    @Select("SELECT * FROM swc_product WHERE attrib NOT LIKE 'XXX%' AND compNo = #{product.compNo}")
    public List<Product> getProductList(@Param("product") Product product);

    @Insert("INSERT INTO swc_product (productCategoryNo, productCategoryName, compNo, custNo, userNo, productName, productDesc, productDefaultPrice, regDatetime, attrib) VALUES (#{product.productCategoryNo}, #{product.productCategoryName}, #{product.compNo}, #{product.custNo}, #{product.userNo}, #{product.productName}, #{product.productDesc}, #{product.productDefaultPrice}, now(), '10000')")
    public int productInsert(@Param("product") Product product);

    @Select("SELECT * FROM swc_product WHERE attrib NOT LIKE 'XXX%' AND productNo = #{productNo} AND compNo = #{compNo}")
    public Product getProduct(@Param("productNo") String productNo, @Param("compNo") int compNo);

    @Update("UPDATE swc_product SET attrib = 'XXXXX' WHERE productNo = #{productNo} AND compNo = #{compNo}")
    public int productDelete(@Param("compNo") int compNo, @Param("productNo") String productNo);

    @Update("UPDATE swc_product SET productCategoryNo = #{product.productCategoryNo}, productCategoryName = #{product.productCategoryName}, custNo = #{product.custNo}, userNo = #{product.userNo}, productName = #{product.productName}, productDesc = #{product.productDesc}, productDefaultPrice = #{product.productDefaultPrice}, modDatetime = now() WHERE productNo = #{product.productNo} AND compNo = #{product.compNo}")
    public int updateProduct(@Param("product") Product product);

    // @Select("SELECT compId, no, categoryName, vendor, writer, name, `desc`, price, image, created, modified FROM bizcore.product WHERE deleted IS NULL AND compId = #{compId}")
    // public List<Product> getProductList(@Param("compId") String compId);

    // @Select("SELECT compId, no, categoryName, vendor, writer, name, `desc`, price, image, created, modified FROM bizcore.swc_product WHERE compId = (SELECT compId FROM swcore2.swc_company WHERE compId = #{compId}) LIMIT #{start}, #{end}")
    // public List<Product> getProductListWithStartAndEnd(@Param("compId") String compId, @Param("start") int start, @Param("end") int end);

    // @Select("SELECT count(*) FROM swc_product WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId})")
    // public int getProductCount(@Param("compId") String compId);

    // @Select("SELECT compId, no, categoryName, vendor, writer, name, `desc`, price, image, created, modified FROM bizcore.product WHERE no = #{no} AND compId = (SELECT compId FROM swcore2.swc_company WHERE compId = #{compId})")
    // public Product getProduct(@Param("compId") String compId, @Param("no") int no);

    // @Update("UPDATE bizcore.product SET deleted = now() WHERE deleted IS NULL AND no = #{no} AND compId = (SELECT compId FROM swc_company WHERE compId = #{compId})")
    // public int removeProduct(@Param("compId") String compId, @Param("no") int no);
}
