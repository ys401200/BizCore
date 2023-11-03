package kr.co.bizcore.v1.svc;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Cust;
import kr.co.bizcore.v1.domain.CustData01;
import kr.co.bizcore.v1.domain.CustData02;
import kr.co.bizcore.v1.domain.CustData03;
import kr.co.bizcore.v1.domain.Sales;
import kr.co.bizcore.v1.domain.Tech;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CustService extends Svc{

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    public List<Cust> getCustList(Cust cust){
        return custMapper.getCustList(cust);
    }

    public Cust getCust(int compNo, String custNo){
        return custMapper.getCust(custNo, compNo);
    }

    public int insertCust(Cust cust) {
        return custMapper.custInsert(cust);
    }

    public CustData01 getCustDataList01(int compNo, String custNo){
        return custMapper.getCustDataList01(custNo, compNo);
    }

    public CustData02 getCustDataList02(int compNo, String custNo){
        return custMapper.getCustDataList02(custNo, compNo);
    }

    public CustData03 getCustDataList03(String custNo){
        return custMapper.getCustDataList03(custNo);
    }

    public List<Sales> getCustSales(Sales sales){
        return custMapper.getCustSales(sales);
    }

    public List<Tech> getCustTech(Tech tech){
        return custMapper.getCustTech(tech);
    }
}
