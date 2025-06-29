package org.naer.blog.Services.Impl;

import jakarta.annotation.Resource;
import org.naer.blog.Mapper.pojo.users;
import org.naer.blog.Mapper.userMapper;
import org.naer.blog.Services.UserSrvices;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class User implements UserSrvices {

    @Resource
    private userMapper userMapper;

    @Override
    public users login(String username, String password) {
        return userMapper.select(username, password);
    }

    @Override
    @Transactional
    public boolean insert(String name, String pwd,String email) {
        return userMapper.insert(new users(name, pwd,email, true, false, false)) > 0;
    }
}
