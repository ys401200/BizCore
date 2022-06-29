package kr.co.bizcore.v1.svc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.mapper.SystemMapper;
import kr.co.bizcore.v1.mapper.UserMapper;

@Service
public abstract class Svc {

    @Autowired
    protected SystemMapper systemMapper;

    @Autowired
    protected UserMapper userMapper;

}
