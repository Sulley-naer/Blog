package org.naer.blog.Mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.naer.blog.Mapper.pojo.users;

@Mapper
public interface getUser {
    @Select("select * from users where user = #{user} and pwd = #{pwd}")
    users select(String user, String pwd);
}
