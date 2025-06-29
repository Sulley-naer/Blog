package org.naer.blog.utils;

import jakarta.annotation.Resource;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.Objects;
import java.util.concurrent.locks.ReentrantLock;

@Component
public class emailUtil {

    Logger logger = LoggerFactory.getLogger(emailUtil.class);

    @Resource
    private JavaMailSenderImpl mailSender;

    public emailUtil(JavaMailSenderImpl mailSender) {
        this.mailSender = mailSender;
    }

    public boolean send(String to, String title, String context) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailSender.getUsername());
            message.setTo(to);
            message.setSubject(title);
            message.setText(context);
            mailSender.send(message);
            return true;
        } catch (MailException e) {
            logger.error("普通邮件发送失败");
            logger.error(e.getMessage());
            return false;
        }
    }

    public boolean sendHtml(String to, String title, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(Objects.requireNonNull(mailSender.getUsername()));
            helper.setTo(to);
            helper.setSubject(title);
            // true 表示发送 HTML 格式
            helper.setText(htmlContent, true);
            mailSender.send(message);
            return true;
        }
        catch (MessagingException e) {
            logger.error("HTML邮件发送失败");
            logger.error(e.getMessage());
            return false;
        }
    }

    // ----------------------------  可选功能 --------------------------------- \\

    // 缓存模板内容的变量 多线程 volatile
    private static volatile String cachedTemplate;
    // 使用锁确保线程安全
    private static final ReentrantLock lock = new ReentrantLock();

    //注册 验证码
    public boolean sendCaptchaEmail(String to, String captcha) {
        try {
            // 1. 加载HTML模板 调用缓存方法
            String htmlContent = getCachedTemplate();

            // 2. 替换验证码占位符
            htmlContent = htmlContent.replace("{{code}}", captcha);

            // 3. 发送邮件
            return sendHtml(to, "blog 网站注册", htmlContent);
        } catch (IOException e) {
            logger.error("加载邮件模板失败: {}", e.getMessage());
            return false;
        }
    }

    // 加载邮件模板
    private String loadEmailTemplate() throws IOException {
        ClassPathResource resource = new ClassPathResource("templates/CaptchaEmail.html");
        try (Reader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)) {
            return FileCopyUtils.copyToString(reader);
        }
    }

    //多线程适配 并发不会出现问题
    private String getCachedTemplate() throws IOException {
        String template = cachedTemplate;
        if (template == null) {
            // 类级别锁
            synchronized (emailUtil.class) {
                template = cachedTemplate;
                if (template == null) {
                    template = loadEmailTemplate();
                    // volatile保证可见性
                    cachedTemplate = template;
                }
            }
        }
        return template;
    }
}
