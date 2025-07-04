package org.naer.blog.Services;

import org.naer.blog.Mapper.pojo.users;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public interface UserSrvices {
    users login(String username, String password);

    boolean insert(String name, String pwd,String email);

    boolean emailCheck(String name, String email);

    void redisAddCaptcha(String key, String captcha, Duration limit);

    boolean forgetPwd(String name, String email, String pwd);
}
