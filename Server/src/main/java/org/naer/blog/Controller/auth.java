package org.naer.blog.Controller;

import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.naer.blog.DTO.ForGetPwdReq;
import org.naer.blog.DTO.RegRequest;
import org.naer.blog.DTO.captchaRequest;
import org.naer.blog.Mapper.pojo.users;
import org.naer.blog.Services.UserSrvices;
import org.naer.blog.common.ErrorResponse;
import org.naer.blog.common.ResultResponse;
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
@RequestMapping("/auth")
@PreAuthorize("permitAll()")
public class auth {

    // 创建日志记录器
    private static final Logger logger = LoggerFactory.getLogger(auth.class);

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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid users user) {
        users res = userSrvices.login(user.getName(), user.getPwd());
        Map<String, Object> authority = new HashMap<>();

        //生成Token
        ResponseEntity<ResultResponse<String>> token = generatedToken(user, res, authority);
        if (token != null) return token;

        return ResponseEntity.badRequest().body(new ErrorResponse<>(400, "登录失败"));
    }

    @PostMapping("/registered")
    public ResponseEntity<?> register(@RequestBody @Valid RegRequest data) {
        String key = "Blog_reg_captcha_" + data.getEmail();
        String codeInRedis = stringRedisTemplate.opsForValue().get(key);

        if (codeInRedis == null) {
            return ResponseEntity.badRequest().body(new ErrorResponse<>(400, "验证码已过期"));
        }

        if (!codeInRedis.equals(data.getCaptcha())) {
            return ResponseEntity.badRequest().body(new ErrorResponse<>(400, "验证码错误"));
        }

        try {
            boolean status = userSrvices.insert(data.getName(), data.getPwd(), data.getEmail());
            stringRedisTemplate.delete(key);

            logger.info("User '{}' 注册成功 用户:", data.getName());

            return ResponseEntity.ok(new ResultResponse<>(200, "注册成功", status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse<>(303, "用户名已存在"));
        }
    }

    @PostMapping("/registered/captcha")
    public boolean captcha(@RequestBody captchaRequest data) {
        String code = String.valueOf(100000 + new Random().nextInt(900000));

        logger.info("发送验证码至:{}", data.getEmail());

        // 可设置过期时间
        userSrvices.redisAddCaptcha("Blog_reg_captcha_" + data.getEmail(), code, Duration.ofMinutes(5));

        return emailUtil.sendCaptchaEmail(data.getEmail(), code);
    }

    @PostMapping("/ForgetPwd")
    public ResponseEntity<?> forgotPassword(@RequestBody @Valid ForGetPwdReq data) {
        String key = "Blog_ForgetPwd_captcha_" + data.getEmail();
        // 没有带验证码 查找用户名与邮箱是否存在数据库
        if (data.getCaptcha() == null) {
            //
            if (userSrvices.emailCheck(data.getUser(), data.getEmail())) {
                String code = String.valueOf(100000 + new Random().nextInt(900000));

                emailUtil.sendCaptchaEmail(data.getEmail(), code);

                userSrvices.redisAddCaptcha(key, code, Duration.ofMinutes(5));

                return ResponseEntity.ok(new ResultResponse<>(200, "验证码已经方式"));
            } else {
                return ResponseEntity.badRequest().body(new ErrorResponse<>(400, "邮箱验证异常", false));
            }
        } else {
            String codeInRedis = stringRedisTemplate.opsForValue().get(key);
            // 验证码判断与修改密码
            if (Objects.equals(codeInRedis, data.getCaptcha())) {
                userSrvices.forgetPwd(data.getUser(), data.getEmail(), data.getPwd());
                stringRedisTemplate.delete(key);
                return ResponseEntity.ok(new ResultResponse<>(200, "修改成功"));
            } else {
                return ResponseEntity.badRequest().body(new ErrorResponse<>(400, "验证码错误"));
            }
        }
    }

    private ResponseEntity<ResultResponse<String>> generatedToken(users user, users res, Map<String, Object> authority) {
        // 登录成功 生成Token
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
            String token = JwtTokenUtil.generateToken(user.getName(), authority);

            // 记录登录者的日志
            logger.info("User '{}' logged in successfully.", user.getName());
            // 创建匿名类并返回响应
            return ResponseEntity.ok(new ResultResponse<>(200, "登录成功", token));
        }
        return null;
    }
}
