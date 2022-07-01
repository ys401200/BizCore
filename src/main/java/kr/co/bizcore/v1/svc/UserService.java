package kr.co.bizcore.v1.svc;

import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.User;

@Service
public class UserService extends Svc {

    public User getBasicUserInfo(String userNo) {
        User result = userMapper.getBasicUserInfo2(userNo);
        return result;
    } // End of getBasicUserInfo

}
