package org.naer.blog.Services.Impl;

import jakarta.annotation.Resource;
import org.naer.blog.Mapper.pojo.users;
import org.naer.blog.Mapper.userMapper;
import org.naer.blog.Services.UserSrvices;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;

@Service
public class User implements UserSrvices {

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Resource
    private userMapper userMapper;

    @Override
    public users login(String username, String password) {
        return userMapper.select(username, password);
    }

    @Override
    @Transactional
    public boolean insert(String name, String pwd, String email) {
        return userMapper.insert(new users(name, pwd, email, true, false, false)) > 0;
    }

    @Override
    public void redisAddCaptcha(String key, String captcha, Duration limit) {
        stringRedisTemplate.opsForValue().set(key, captcha, Duration.ofMinutes(5));
    }

    @Override
    public boolean forgetPwd(String name, String email, String pwd) {
        return userMapper.updatePwd(name, email, pwd) > 0;
    }

    @Override
    @Transactional
    public boolean emailCheck(String name, String email) {
        return userMapper.selectByEmail(name, email) != null;
    }
}
