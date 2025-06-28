package org.naer.blog.Filter;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.naer.blog.utils.JwtTokenUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // 放行登录接口
        String uri = request.getRequestURI();
        if ("/login".equals(uri)) {
            filterChain.doFilter(request, response);
            return;
        }

        // 获取 token 令牌
        String token = request.getHeader("Authorization");
        String username = null;

        if (token == null) {
            logger.info("Authorization header is empty");
            filterChain.doFilter(request, response);
        } else {
            try {
                Claims claims = JwtTokenUtil.parseJwt(token);
                // 解析 JWT token 获取用户名
                username = JwtTokenUtil.parseJwt(token).get("username").toString();
                logger.info("LoginUser: {}", username);

                // 根据存储权限 进行赋权
                empowerment(claims, username);

                // 继续处理请求
                filterChain.doFilter(request, response);

            } catch (Exception e) {
                logger.error("Token validation failed\n");
                // Token 无效，返回 401
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Token is invalid or expired");
            }
        }
    }

    //赋权操作
    private static void empowerment(Claims claims, String username) {
        List<String> permissions = (List<String>) claims.get("permission");
        if(permissions != null) {

            List<SimpleGrantedAuthority> authorities = new ArrayList<>();
            for (String item : permissions) {
                authorities.add(new SimpleGrantedAuthority(item));
            }
            // 将认证信息设置到 SecurityContext
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(username, null, authorities);

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
    }
}
