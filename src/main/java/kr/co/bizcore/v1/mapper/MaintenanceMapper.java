package kr.co.bizcore.v1.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;

public interface MaintenanceMapper {

    // 새 유지보수 데이터 insert하는 함수
    @Insert("Insert into bizcore.maintenance (compId, contract, customer, product, startDate, endDate, engineer, related) values (#{compId},#{contract},#{customer},#{product},#{startDate},#{endDate},#{engineer},#{related})")
    public int insertMaintenance(@Param("compId") String compId, @Param("contract") int contract,
            @Param("customer") int customer, @Param("product") int product,
            @Param("startDate") String startDate, @Param("endDate") String endDate, @Param("engineer") int engineer, @Param("related") String related);

}