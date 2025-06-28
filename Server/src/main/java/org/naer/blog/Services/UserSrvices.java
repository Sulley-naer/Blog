package org.naer.blog.Services;

import org.naer.blog.Mapper.pojo.users;
import org.springframework.stereotype.Service;

@Service
public interface UserSrvices {
    public users login(String username, String password);
}
