package org.naer.blog.Services.Impl;

import jakarta.annotation.Resource;
import org.naer.blog.Mapper.pojo.users;
import org.naer.blog.Services.UserSrvices;
import org.naer.blog.Mapper.getUser;
import org.springframework.stereotype.Service;

@Service
public class User implements UserSrvices {

    @Resource
    private getUser getUser;

    @Override
    public users login(String username, String password) {
        return getUser.select(username, password);
    }
}
