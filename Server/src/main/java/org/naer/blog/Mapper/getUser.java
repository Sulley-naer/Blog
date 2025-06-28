package org.naer.blog.Mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.naer.blog.Mapper.pojo.users;

@Mapper
public interface getUser {
    @Select("select * from user where name = #{name} and pwd = #{pwd}")
    users select(String name, String pwd);
}
