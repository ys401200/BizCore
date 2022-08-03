package kr.co.bizcore.v1.svc;

import java.util.List;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Sales;
import kr.co.bizcore.v1.domain.SimpleSales;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class SalesService extends Svc{

    private static final Logger logger = LoggerFactory.getLogger(SalesService.class);

    public String getSalesList(String compId){
        String result = null;
        List<SimpleSales> list = null;
        SimpleSales each = null;
        int x = 0;

        list = salesMapper.getSalesList(compId);
        if(list != null && list.size() > 0) for(x = 0 ; x < list.size() ; x++){
            each = list.get(x);
            if(result == null)  result = "[";
            if(x > 0)   result += ",";
            result += each.toJson();
        }
        if(result != null)  result += "]";
        return result;
    } // End of getSalesList()

    public String getSales(String salesNo, String compId){
        Sales sales = null;
        sales = salesMapper.getSales(salesNo, compId);
        return sales == null ? null : sales.toJson();
    } // End of getSales();

    public boolean addSales(Sales sales, String compId){
        int x = -1;
        x = salesMapper.addSales(sales, compId);
        return x > 0;
    }

    public boolean modifySales(String no, Sales sales, String compId){
        int x = -1;
        x = salesMapper.modifySales(no, sales, compId);
        return x > 0;
    }

    public boolean removeSales(String no, String compId){
        int x = -1;
        x = salesMapper.removeSales(no, compId);
        return x > 0;
    }
    
}
