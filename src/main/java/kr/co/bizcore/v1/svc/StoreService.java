package kr.co.bizcore.v1.svc;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Store;

@Service
public class StoreService extends Svc{
    private static final Logger logger = LoggerFactory.getLogger(StoreService.class);

    public List<Store> getStoreList(Store store){
        return storeMapper.getStoreList(store);
    }

    public Store getStore(int compNo, String storeNo){
        Store store = null;
        store = storeMapper.getStore(storeNo, compNo);
        return store;
    }

    public int insertStore(Store store) {
        return storeMapper.storeInsert(store);
    }

    public int  delete(int compNo, String storeNo) {
        return storeMapper.storeDelete(compNo, storeNo);
    }

    public int updateStore(Store store) {
        return storeMapper.updateStore(store);
    }
}
