package org.naer.blog;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

/**
 * @author Administrator
 */
@SpringBootApplication
@ComponentScan("org.naer")
@MapperScan("org.naer.blog.Mapper")
@EnableMethodSecurity
@PropertySource("classpath:mail.properties")
public class BlogApplication {
    public static void main(String[] args) {
        SpringApplication.run(BlogApplication.class, args);
    }
}
