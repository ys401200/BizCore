package kr.co.bizcore.v1.mapper;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Select;

public interface AccountingMapper2 {
    
    @Select("SELECT class_a, class_b, class_c, class_d, class_e, CAST(code AS CHAR) code FROM bizcore.account_subject WHERE deleted IS NULL AND compId = #{compId} ORDER BY code")
    public List<HashMap<String, String>> getAccountSubject(String compId);
}
