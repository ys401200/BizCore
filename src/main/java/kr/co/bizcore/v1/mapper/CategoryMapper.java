package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.bizcore.v1.domain.Category;

public interface CategoryMapper {
    @Select("SELECT * FROM swc_custcategory WHERE attrib NOT LIKE 'XXX%' AND compNo = #{category.compNo}")
    public List<Category> getCategoryList(@Param("category") Category category);

    @Select("SELECT * FROM swc_custcategory WHERE attrib NOT LIKE 'XXX%' AND custCategoryNo = #{custCategoryNo} AND compNo = #{compNo}")
    public Category getCategory(@Param("custCategoryNo") String custCategoryNo, @Param("compNo") int compNo);

    @Insert("INSERT INTO swc_custcategory (userNo, compNo, custCategoryName, regDatetime) VALUES (#{category.userNo}, #{category.compNo}, #{category.custCategoryName}, now())")
    public int categoryInsert(@Param("category") Category category);

    @Update("UPDATE swc_custcategory SET attrib = 'XXXXX' WHERE custCategoryNo = #{custCategoryNo} AND compNo = #{compNo}")
    public int categoryDelete(@Param("compNo") int compNo, @Param("custCategoryNo") String custCategoryNo);

    @Update("UPDATE swc_custcategory SET userNo = #{category.userNo}, custCategoryName = #{category.custCategoryName}, modDatetime = now() WHERE custCategoryNo = #{category.custCategoryNo} AND compNo = #{category.compNo}")
    public int updateCategory(@Param("category") Category category);
}
