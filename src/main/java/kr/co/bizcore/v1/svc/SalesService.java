package kr.co.bizcore.v1.svc;

import java.time.LocalDate;
import java.util.List;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Sales;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class SalesService extends Svc{

    private static final Logger logger = LoggerFactory.getLogger(SalesService.class);

    public List<Sales> getSalesList(Sales sales){
        // String result = null;
        // List<Sales> list = null;
        // Sales each = null;
        // int x = 0;

        // list = salesMapper.getSalesList(compId);
        // if(list != null && list.size() > 0) for(x = 0 ; x < list.size() ; x++){
        //     each = list.get(x);
        //     if(result == null)  result = "[";
        //     if(x > 0)   result += ",";
        //     result += each.toJson();
        // }
        // if(result != null)  result += "]";
        if(sales.getToDate() == null){
            LocalDate now = LocalDate.now();
            sales.setFromDate(now.getYear() + "-01-01");
            sales.setToDate(now.getYear() + "-12-31");
        }
        
        return salesMapper.getSalesList(sales);
    } // End of getSalesList()

    public Sales getSales(String salesNo, String compId){
        Sales sales = null;
        sales = salesMapper.getSales(salesNo, compId);
        return sales;
    } // End of getSales();

    public boolean addSales(Sales sales, String compId){
        int x = -1;
        String sql = null;
        sql = sales.createInsertQuery(null, compId);
        x = executeSqlQuery(sql);
        return x > 0;
    }

    public boolean modifySales(String no, Sales sales, String compId){
        int x = -1;
        Sales ogn = null;
        String sql = null;

        ogn = getSales(no, compId);
        sql = ogn.createUpdateQuery(sales, null);
        sql = sql + " WHERE salesno = " + no + " AND compno = (SELECT compno FROM swc_company WHERE compid = '" + compId + "')";
        x = executeSqlQuery(sql);
        return x > 0;
    }

    public boolean removeSales(String no, String compId){
        int x = -1;
        x = salesMapper.removeSales(no, compId);
        return x > 0;
    }
    
}
