package org.naer.blog.config;

import jakarta.mail.MessagingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class MailConfig {

    static Logger logger = LoggerFactory.getLogger(MailConfig.class);

    @Value("${email.user}")
    private String user;

    @Value("${email.code}")
    private String code;

    @Value("${email.step}")
    private String host;

    @Value("${email.port}")
    private int port;

    @Bean
    public JavaMailSenderImpl mailSender() {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(host);
        sender.setPort(port);
        sender.setUsername(user);
        sender.setPassword(code);
        sender.setDefaultEncoding("UTF-8");

        Properties props = sender.getJavaMailProperties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.ssl.enable", "true");
        props.put("mail.debug", "false");
        props.put("mail.transport.protocol", "smtp");

        //多线程测试链接，防止阻塞启动服务
        new Thread(() -> {
            try {
                sender.testConnection();
                logger.info("email initial success");
            } catch (MessagingException e) {
                logger.warn("Email connection failed", e);
            }
        }).start();

        return sender;
    }
}
