package kr.co.bizcore.v1.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;

public interface MaintenanceMapper {

    // 새 유지보수 데이터 insert하는 함수
    @Insert("Insert into bizcore.maintenance (compId, contract, customer, product, startDate, endDate, engineer) values (?,?,?,?,?,?,?)")
    public String insertMaintenance(@Param("compId") String compId, @Param("contract") String contract,
            @Param("customer") String customer, @Param("product") String product,
            @Param("startDate") String startDate, @Param("endDate") String endDate, @Param("engineer") String engineer);

}