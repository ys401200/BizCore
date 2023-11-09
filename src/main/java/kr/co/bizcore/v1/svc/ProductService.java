package kr.co.bizcore.v1.svc;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Cust;
import kr.co.bizcore.v1.domain.Product;
import kr.co.bizcore.v1.domain.Sopp;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ProductService extends Svc{

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    public List<Product> getProductList(Product product){
        return productMapper.getProductList(product);
    }

    public int insertProduct(Product product) {
        return productMapper.productInsert(product);
    }

    public Product getProduct(int compNo, String productNo){
        return productMapper.getProduct(productNo, compNo);
    }

    public int  delete(int compNo, String productNo) {
        return productMapper.productDelete(compNo, productNo);
    }

    public int updateProduct(Product product) {
        return productMapper.updateProduct(product);
    }
}
