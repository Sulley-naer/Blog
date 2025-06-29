package org.naer.blog.Mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.naer.blog.Mapper.pojo.users;

@Mapper
public interface userMapper {
    @Select("select * from user where name = #{name} and pwd = #{pwd}")
    users select(String name, String pwd);

    @Insert("insert into user (name, pwd,email, `select`, `update`, `delete`) " +
            "values (#{name}, #{pwd},#{email}, #{select}, #{update}, #{delete})")
    int insert(users user);
}
