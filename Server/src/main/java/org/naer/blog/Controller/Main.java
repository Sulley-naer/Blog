package org.naer.blog.Controller;

import jakarta.annotation.Resource;
import org.naer.blog.Mapper.pojo.users;
import org.naer.blog.Services.UserSrvices;
import org.naer.blog.utils.JwtTokenUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @RequestMapping("/")
    public String app() {
        return "app";
    }

    @RequestMapping("/hello")
    @PreAuthorize("hasAnyAuthority('update')")
    //TODO待修复 PreAuthorize 注解无效
    public String hello() {
        return "hello world";
    }

    @RequestMapping("/login")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> test(String name, String pwd) {
        users res = userSrvices.login(name, pwd);

        Map<String, List<String>> authority = new HashMap<>();

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
}
