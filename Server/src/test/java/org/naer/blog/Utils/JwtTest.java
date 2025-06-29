package org.naer.blog.Utils;

import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.Test;
import org.naer.blog.utils.JwtTokenUtil;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@SuppressWarnings("unchecked")
@SpringBootTest
public class JwtTest {

    @Test
    void Main() {
        String token = generateToken();

        assert token != null;
        assert validationToken(token);

        Claims claims = parseToken(token);

        if (!(claims.get("username")).equals("naer")) throw new AssertionError();

        List<String> permissionSets = (List<String>) claims.get("authorities");
        assert permissionSets.size() > 2;
    }

    private String generateToken (){
        Map<String, Object> authorities = new HashMap<>();

        List<String> permissionSets = new ArrayList<>();
        permissionSets.add("select");
        permissionSets.add("update");
        permissionSets.add("delete");

        authorities.put("authorities", permissionSets);

        return JwtTokenUtil.generateToken("naer",authorities);
    }

    private boolean validationToken(String token){
        return JwtTokenUtil.validateToken(token);
    }

    private Claims parseToken(String token){
        return JwtTokenUtil.parseJwt(token);
    }
}
