package org.naer.blog.config;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.logging.Logger;

@Slf4j
@Configuration
@PropertySource("classpath:resource-storage.properties")
public class WebConfig implements WebMvcConfigurer {

    @Getter
    @Value("${resource.storage.local-path}")
    String path;

    @Getter
    @Value("${resource.storage.server-url}")
    String url;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 映射访问路径
        registry.addResourceHandler("/static/**")
                // 本地文件夹路径
                .addResourceLocations(path);

        //远程资源站
        registry.addResourceHandler("/cdn/**")
                // 本地文件夹路径
                .addResourceLocations(url);

        log.info(path);
    }
}
