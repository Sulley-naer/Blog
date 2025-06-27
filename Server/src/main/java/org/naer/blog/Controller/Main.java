package org.naer.blog.Controller;

import jakarta.annotation.Resource;
import org.naer.blog.Mapper.getUser;
import org.naer.blog.Mapper.pojo.users;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Administrator
 */
@RestController
public class Main {

    @Resource
    getUser getUser;

    @RequestMapping("/")
    @PreAuthorize("permitAll()")
    public String app() {
        return "app";
    }

    @RequestMapping("/hello")
    public String hello() {
        return "hello world";
    }

    @RequestMapping("/test")
    @PreAuthorize("permitAll()")
    public users test(String user, String password) {
        return getUser.select(user,password);
    }
}
