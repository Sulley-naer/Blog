package org.naer.blog.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import javax.crypto.spec.SecretKeySpec;
import javax.xml.crypto.Data;
import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

public class JwtTokenUtil {

    // 固定的密钥 (可以在配置文件中或环境变量中定义)
    private static final String SECRET_KEY_STRING = "1234567890abcdef1234567890abcdef"; // HS256 密钥长度要求32字符

    // 将密钥转为Key类型
    private static final Key SECRET_KEY = new SecretKeySpec(SECRET_KEY_STRING.getBytes(), SignatureAlgorithm.HS256.getJcaName());


    // JWT有效时间 七天
    private static final long VALIDITY = 1000 * 60 * 60 * 24 * 7;

    /*
     * 生成JWT
     */
    public static String generateToken(String username) {
        // 获取当前时间戳
        long currentTimeMillis = System.currentTimeMillis();
        // 将时间戳加到subject中
        String subject = username + "_" + currentTimeMillis;

        // 构建JWT
        return Jwts.builder()
                // 设置token 头部标识符
                .subject(subject)
                // 设置用户名为JWT的subject
                .issuer("MyBlog")
                // 可选，设置发行者
                .issuedAt(new Date())
                // 设置签发时间
                .expiration(new Date(System.currentTimeMillis() + VALIDITY))
                // 设置过期时间
                .id(UUID.randomUUID().toString())
                // 使用HS256算法签名
                .claim("username", username)
                // 可选：添加关键数据
                .signWith(SECRET_KEY)
                // 可选：添加其他数据
                .compact();
    }

    /*
     * 从JWT中解析Claims
     */
    private static Claims getClaimsFromToken(String token) {
        return Jwts.parser().setSigningKey(SECRET_KEY).build().parseSignedClaims(token).getPayload();
    }

    /*
     * 从JWT中解析用户名
     */
    public static String getUsernameFromToken(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    /*
     * 获取JWT的过期时间
     */
    public static Date getExpirationDateFromToken(String token) {
        return getClaimsFromToken(token).getExpiration();
    }

    /*
     * 检查JWT是否过期 false 未过期
     */
    public static boolean isTokenExpired(String token) {
        return getExpirationDateFromToken(token).before(new Date()); 
    }

    /*
     ** 验证JWT有效性
     **
     */
    public static boolean validateToken(String token) {
        return (getUsernameFromToken(token)!=null) && !isTokenExpired(token);
    }

    /*
     *  验证JWT数据
     */
    public static boolean validateTokenWithName(String token, String field) {
        return (field.equals(getUsernameFromToken(token)) && !isTokenExpired(token));
    }

    /*
     * 验证JWT并解析
     */
    public static Claims parseJwt(String token) throws JwtException {
        try {
            // 解析JWT并返回Claims
            return Jwts.parser().setSigningKey(SECRET_KEY).build().parseSignedClaims(token).getPayload();
        } catch (JwtException e) {
            // 解析或签名验证失败，抛出JwtException
            throw new JwtException("无效Token", e);
        }
    }

    /*
     * 创建带有属性声明的Token
     * @Params Map<string,Object>
     */
    public static String generateTokenWithClaims(String username, Map<String, Object> customClaims) {
        return Jwts.builder()
                .claims(customClaims)
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + VALIDITY))
                .signWith(SECRET_KEY)
                .compact();
    }

}
