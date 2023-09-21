package kr.co.bizcore.v1.svc;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Cust;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CustService extends Svc{

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    public List<Cust> getCustList(Cust cust){
        return custMapper.getCustList(cust);
    } // End of getSalesList()
}
