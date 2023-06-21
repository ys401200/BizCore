package kr.co.bizcore.v1.svc;

import java.time.LocalDate;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Sales;
import kr.co.bizcore.v1.domain.Tech;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class TechService extends Svc{
    private static final Logger logger = LoggerFactory.getLogger(SalesService.class);

    public List<Tech> getTechList(Tech tech){
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
        if(tech.getToDate() == null){
            LocalDate now = LocalDate.now();
            tech.setFromDate(now.getYear() + "-01-01");
            tech.setToDate(now.getYear() + "-12-31");
        }
        
        return techMapper.getTechList(tech);
    } // End of getSalesList()

    public Tech getTech(int compNo, String techdNo){
        Tech tech = null;
        tech = techMapper.getTech(techdNo, compNo);
        return tech;
    } // End of getSales();

    public int insertSales(Sales sales) {
        return salesMapper.salesInsert(sales);
    }

    public int  delete(int compNo, String salesNo) {
        return salesMapper.salesDelete(compNo, salesNo);
    }

    public int updateSales(Sales sales) {
        return salesMapper.updateSales(sales);
    }
}
