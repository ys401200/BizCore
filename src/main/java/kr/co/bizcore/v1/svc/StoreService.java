package kr.co.bizcore.v1.svc;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Store;

@Service
public class StoreService extends Svc{
    private static final Logger logger = LoggerFactory.getLogger(SalesService.class);

    public List<Store> getStoreList(Store store){
        return storeMapper.getStoreList(store);
    }
}
