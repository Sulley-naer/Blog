package org.naer.blog.Filter;

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
import java.util.Collections;

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
                // 解析 JWT token 获取用户名
                username = JwtTokenUtil.parseJwt(token).get("username").toString();
                logger.info("LoginUser: {}", username);

                // 添加 select 权限
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("select");

                // 将认证信息设置到 SecurityContext
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(username, null, Collections.singletonList(authority));

                SecurityContextHolder.getContext().setAuthentication(authentication);

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
}
