package org.naer.blog.Controller;

import jakarta.annotation.Resource;
import org.naer.blog.Mapper.getUser;
import org.naer.blog.Mapper.pojo.users;
import org.naer.blog.config.RedisConfig;
import org.naer.blog.utils.JwtTokenUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.Arrays;

import static java.time.temporal.ChronoUnit.HOURS;

/**
 * @author Administrator
 */
@RestController
public class Main {

    // 创建日志记录器
    private static final Logger logger = LoggerFactory.getLogger(Main.class);

    @Resource
    private getUser getUser;
    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @RequestMapping("/")
    public String app() {
        return "app";
    }

    @RequestMapping("/hello")
    @PreAuthorize("hasAnyAuthority('select')")
    //TODO待修复 PreAuthorize 注解无效
    public String hello() {
        return "hello world";
    }

    @RequestMapping("/login")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> test(String user, String pwd) {
        users select = getUser.select(user, pwd);

        if (select != null) {
            String token = JwtTokenUtil.generateToken(user);

            // 记录登录者的日志
            logger.info("User '{}' logged in successfully.", user);

            // 创建匿名类并返回响应
            return ResponseEntity.ok(new Object() {
                public final String status = "success";  // 状态
                public final Object data = token;        // 数据：token
            });
        }

        return ResponseEntity.badRequest().build();
    }
}
