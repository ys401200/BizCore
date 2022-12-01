package kr.co.bizcore.v1.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;

import lombok.experimental.PackagePrivate;

public interface CardMapper {

    // 읽어온 데이터 insert하는 함수
    @Insert("INSERT INTO bizcore.carddata (compId, transactionDate, cardNo, permitNo, storeTitle, permitAmount, created) VALUES (#{compId},#{transactionDate},#{cardNo},#{storeTitle},#{permitAmount}, now())")
    public int insertCardDate(@Param("compId") String compId, @Param("transactionDate") String transactionDate,
            @Param("cardNo") String cardNo, @Param("permitNo") String permitNo, @Param("storeTitle") String storeTitle,
            @Param("permitAmount") String permitAmount);

}
