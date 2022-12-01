package kr.co.bizcore.v1.svc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.mapper.CardMapper;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CardService extends Svc {

     @Autowired
     CardMapper cardMapper;

     public int insertCardData(String compId, String transactionDate, String cardNo, String permitNo, String storeTitle,
               String permitAmount) {
          int result = 0;
          result = cardMapper.insertCardDate(compId, transactionDate, cardNo, permitNo, storeTitle, permitAmount);
          return result;
     }
}
