package org.naer.blog;

import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.Test;
import org.naer.blog.utils.JwtTokenUtil;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BlogApplicationTests {

	@Test
	void JwtTest() throws InterruptedException {
		String token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ6cyIsImlzcyI6Ik15QmxvZyIsImlhdCI6MTc1MTA2NjA5NiwiZXhwIjoxNzUxNjcwODk2LCJqdGkiOiI1MTA3YWE2MC03NTE5LTQ1YTQtYTk4Zi0xNjkwZTVhYzhhMTAiLCJ1c2VybmFtZSI6InpzIn0.RnUCC39M0lFHdekzSMoe78EVJiDFEunywZu0ehw7J2U";

		Claims claims = JwtTokenUtil.parseJwt(token);
//		assert claims.getSubject().equals("naer");
		System.out.println(token);

		System.out.println("用户："+claims.get("username"));

		try {
			System.out.println("过期检测Token：" + JwtTokenUtil.isTokenExpired(token));
		}catch (Exception e){
			System.out.println(e.getMessage() + "\n已经过期");
		}

		System.out.println("token有效性：" + JwtTokenUtil.validateToken(token));

		System.out.println(JwtTokenUtil.parseJwt(token));
	}
}
