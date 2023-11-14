package kr.co.bizcore.v1.svc;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Category;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CategoryService extends Svc{
    private static final Logger logger = LoggerFactory.getLogger(CategoryService.class);

    public List<Category> getCategoryList(Category category){
        return categoryMapper.getCategoryList(category);
    }

    public Category getCategory(int compNo, String custCategoryNo){
        Category category = null;
        category = categoryMapper.getCategory(custCategoryNo, compNo);
        return category;
    }

    public int insertCategory(Category category) {
        return categoryMapper.categoryInsert(category);
    }

    public int  delete(int compNo, String custCategoryNo) {
        return categoryMapper.categoryDelete(compNo, custCategoryNo);
    }

    public int updateCategory(Category category) {
        return categoryMapper.updateCategory(category);
    }
}
