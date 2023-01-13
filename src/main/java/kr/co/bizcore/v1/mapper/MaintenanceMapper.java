package kr.co.bizcore.v1.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;

public interface MaintenanceMapper {

    // 새 유지보수 데이터 insert하는 함수
    @Insert("Insert into bizcore.maintenance (compId, contract, customer, product, startDate, endDate, engineer, amount, related, created) values (#{compId},(select `no` from bizcore.contract  where related like concat('%','{\"parent\":\"sopp:',#{sopp},'\"','%')),#{customer},#{product},#{startDate},#{endDate},#{engineer},#{amount},#{related},now())")
    public int insertMaintenance(@Param("compId") String compId, @Param("sopp") String sopp,
            @Param("customer") int customer, @Param("product") int product,
            @Param("startDate") String startDate, @Param("endDate") String endDate, @Param("engineer") int engineer, @Param("amount") int amount, @Param("related") String related);

}