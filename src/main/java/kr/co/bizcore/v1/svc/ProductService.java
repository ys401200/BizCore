package kr.co.bizcore.v1.svc;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Product;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ProductService extends Svc{

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    public List<Product> getProductList(Product product){
        return productMapper.getProductList(product);
    } // End of getSalesList()
}
