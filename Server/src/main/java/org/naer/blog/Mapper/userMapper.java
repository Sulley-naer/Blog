package org.naer.blog.Mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.naer.blog.Mapper.pojo.users;

@Mapper
public interface userMapper {
    @Select("select * from user where name = #{name} and pwd = #{pwd}")
    users select(String name, String pwd);

    @Insert("insert into user (name, pwd,email, `select`, `update`, `delete`) " +
            "values (#{name}, #{pwd},#{email}, #{select}, #{update}, #{delete})")
    int insert(users user);

    @Select("select * from user where name = #{name} and email = #{email}")
    users selectByEmail(String name, String email);

    @Update("update user set pwd = #{pwd} where name = #{name} and email = #{email}")
    int updatePwd(String name, String email, String pwd);
}
