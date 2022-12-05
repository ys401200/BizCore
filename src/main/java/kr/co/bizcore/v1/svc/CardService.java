package kr.co.bizcore.v1.svc;

import java.util.List;

import org.json.JSONArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.bizcore.v1.domain.CoporateCard;
import kr.co.bizcore.v1.domain.CoporateCardDetail;
import kr.co.bizcore.v1.mapper.CardMapper;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CardService extends Svc {

     @Autowired
     private CardMapper cardMapper;

     private static final Logger logger = LoggerFactory.getLogger(CardService.class);

     public int insertCardData(String compId, String transactionDate, String cardNo, String permitNo, String storeTitle,
               String permitAmount) {
          int result = 0;
          int no = 0;
          no = getNextNumberFromDB(compId, "bizcore.carddata");
          result = cardMapper.insertCardData(no,compId, transactionDate, cardNo, permitNo, storeTitle, permitAmount);
          return result;
     }

     public String getCardList(String compId) {
          String result = null;
          CoporateCard each = null;
          List<CoporateCard> list = null;

          list = cardMapper.getcardList(compId);

          if (list != null && list.size() > 0) {
               result = "[";
               for (int x = 0; x < list.size(); x++) {
                    each = list.get(x);
                    if (x > 0)
                         result += ",";
                    result += each.toJson();
               }
               result += "]";
          }

          return result;

     }

     public String getCardDetail(String compId, String alias) {
          String result = "";
          CoporateCardDetail each = new CoporateCardDetail(); 
          List<CoporateCardDetail> list = null; 
          ObjectMapper mapper = new ObjectMapper();
          String jsonInString = null;
          list = cardMapper.getCardDetail(compId, alias); 
          logger.info(list.size()+"길이 확인 ");
          if(list != null && list.size() > 0) {
               result = "[";
               for (int x = 0; x < list.size(); x++) {
                    each = list.get(x);
                    if (x > 0)
                         result += ","; 
                         try {
                              jsonInString = mapper.writeValueAsString(each);
                              result += jsonInString;
                         } catch (JsonProcessingException e) {
                              e.printStackTrace();
                         }
                    
               }
               result += "]";
          }
          
          return result;
     }
}
