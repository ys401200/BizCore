package kr.co.bizcore.v1.mapper;
import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.CoporateCard;


public interface CardMapper {

    // 읽어온 엑셀 데이터 insert하는 쿼리 
    @Insert("INSERT INTO bizcore.carddata (compId, transactionDate, cardNo, permitNo, storeTitle, permitAmount, created) VALUES (#{compId},#{transactionDate},#{cardNo},#{permitNo},#{storeTitle},#{permitAmount}, now())")
    public int insertCardDate(@Param("compId") String compId, @Param("transactionDate") String transactionDate,
            @Param("cardNo") String cardNo, @Param("permitNo") String permitNo, @Param("storeTitle") String storeTitle,
            @Param("permitAmount") String permitAmount);
    
    // 카드 리스트 가져오는 쿼리 
    @Select("select idx, compId, card , alias , `div`, bank, status, hipass, remark, issued, created, modified, deleted from bizcore.corporate_card where compId = #{compId}")
    public List<CoporateCard> getcardList(@Param("compId") String compId);
}  
