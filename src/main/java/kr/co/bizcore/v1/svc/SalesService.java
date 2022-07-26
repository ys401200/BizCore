package kr.co.bizcore.v1.svc;

import java.util.List;

import kr.co.bizcore.v1.domain.Sales;
import kr.co.bizcore.v1.domain.SimpleSales;

public class SalesService extends Svc{

    public String getSalesList(String compId){
        String result = null;
        List<SimpleSales> list = null;
        SimpleSales each = null;
        int x = 0;

        list = salesMapper.getSalesList(compId);
        if(list != null && list.size() > 0) for(x = 0 ; x < list.size() ; x++){
            each = list.get(x);
            if(result == null)  result = "{";
            if(x > 0)   result += ",";
            result += each.toJson();
        }
        if(result != null)  result += "}";
        return result;
    } // End of getSalesList()

    public String getSales(int salesNo, String compId){
        Sales sales = null;
        sales = salesMapper.getSales(salesNo, compId);
        return sales == null ? null : sales.toJson();
    } // End of getSales();
    
}
