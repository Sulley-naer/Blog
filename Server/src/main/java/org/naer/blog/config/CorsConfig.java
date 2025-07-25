package org.naer.blog.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOriginPattern("*");
        // 允许所有源
        config.setAllowCredentials(true);
        // 允许发送cookie
        config.addAllowedMethod("*");
        // 允许所有方法
        config.addAllowedHeader("*");
        // 允许所有头
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // 应用于所有路径
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
