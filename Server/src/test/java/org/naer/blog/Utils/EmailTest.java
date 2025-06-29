package org.naer.blog.Utils;

import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@SpringBootTest
public class EmailTest {

    @Autowired
    private org.naer.blog.utils.emailUtil emailUtil;

    Logger logger = LoggerFactory.getLogger(EmailTest.class);

    @Resource
    private JavaMailSenderImpl mailSender;

    @Test
    public void Main() {
        play();
    }

    private void sendEmail() {
        emailUtil.send("1444736434@qq.com", "Test", "From Blog EmailTest");
    }

    private void ws() {
        emailUtil.send("3220145931@qq.com", "勾史", "勾史勾史勾史勾史勾史勾史勾史勾史勾史勾史勾史勾史勾史勾史勾史勾史勾史勾史");
    }

    private void play() {
        String testEmail = "3220145931@qq.com";
        String testCaptcha = "123456"; // 实际使用时应生成随机验证码

        boolean result = emailUtil.sendCaptchaEmail(testEmail, testCaptcha);
        logger.info("邮件发送成功{}", result);
    }
}
