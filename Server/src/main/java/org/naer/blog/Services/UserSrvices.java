package org.naer.blog.Services;

import org.naer.blog.Mapper.pojo.users;
import org.springframework.stereotype.Service;

@Service
public interface UserSrvices {
    users login(String username, String password);

    boolean insert(String name, String pwd,String email);
}
