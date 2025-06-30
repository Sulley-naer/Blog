package org.naer.blog.Controller;

import jakarta.annotation.Resource;
import lombok.Data;
import lombok.Setter;
import org.naer.blog.Mapper.pojo.users;
import org.naer.blog.Services.UserSrvices;
import org.naer.blog.utils.JwtTokenUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.*;

/**
 * @author Administrator
 */
@RestController
public class Main {

    // 创建日志记录器
    private static final Logger logger = LoggerFactory.getLogger(Main.class);

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Resource
    private UserSrvices userSrvices;
    @Resource
    private org.naer.blog.utils.emailUtil emailUtil;

    @RequestMapping("/")
    public String app() {
        return "app";
    }

    @RequestMapping("/hello")
    @PreAuthorize("hasAnyAuthority('update')")

    public String hello() {
        return "hello world";
    }

    @RequestMapping("/login")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> test(String name, String pwd) {
        users res = userSrvices.login(name, pwd);
        Map<String, Object> authority = new HashMap<>();

        if (res != null) {
            //验证权限
            List<String> permissionSets = new ArrayList<>();

            if (res.isSelect()) {
                permissionSets.add("select");
            }
            if (res.isDelete()) {
                permissionSets.add("delete");
            }
            if (res.isUpdate()) {
                permissionSets.add("update");
            }
            //存放权限至集合
            authority.put("email", res.getEmail());
            authority.put("permission", permissionSets);

            //生成token 带有权限
            String token = JwtTokenUtil.generateToken(name, authority);

            // 记录登录者的日志
            logger.info("User '{}' logged in successfully.", name);
            // 创建匿名类并返回响应
            return ResponseEntity.ok(new Object() {
                public final String status = "success";  // 状态
                public final Object data = token;        // 数据：token
            });
        }

        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/registered")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> register(String name, String pwd, String email, String captcha) {
        String key = "Blog_reg_captcha_" + email;
        String codeInRedis = stringRedisTemplate.opsForValue().get(key);

        if (codeInRedis == null) {
            return ResponseEntity.badRequest().body("验证码已过期或不存在");
        }

        if (!codeInRedis.equals(captcha)) {
            return ResponseEntity.badRequest().body("验证码错误");
        }

        try {
            userSrvices.insert(name, pwd, email);
            // 可选：注册成功后删除验证码
            stringRedisTemplate.delete(key);
            logger.info("User '{}' registered successfully.", name);
            return ResponseEntity.ok("注册成功");
        } catch (Exception e) {
            return ResponseEntity.status(303).body("用户名已存在");
        }
    }

    @PostMapping("/registered/captcha")
    @PreAuthorize("permitAll()")
    public boolean captcha(@RequestBody captchaRequest data) {
        String code = String.valueOf(1000 + new Random().nextInt(9000));

        logger.info("发送验证码至:{}", data.email);

        // 可设置过期时间
        stringRedisTemplate.opsForValue().set("Blog_reg_captcha_" + data.email, code, Duration.ofMinutes(5));
        return emailUtil.sendCaptchaEmail(data.email, code);
    }

    @Data
    static class captchaRequest {
        @Setter
        private String email;
    }
}
