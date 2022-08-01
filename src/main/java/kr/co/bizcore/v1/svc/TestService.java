package kr.co.bizcore.v1.svc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TestService extends Svc{

    public String test1(){
        return (new Date(testMapper.test().getTime() + timeCorrect)).toString();
    }

    public String test2(){
        String result = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement("SELECT NOW()");
            rs = pstmt.executeQuery();
            if(rs.next())   result = rs.getDate(1).toString();
        } catch (SQLException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        return result;
    }
    
}
