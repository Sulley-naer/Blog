package org.naer.blog.Mapper.pojo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@SuppressWarnings("LombokGetterMayBeUsed")
@Data
public class users {
    private int id;

    @NotNull
    @NotBlank
    private String name;
    @NotNull
    @NotBlank
    private String pwd;
    private boolean select;
    private boolean update;
    private boolean delete;
    private String email;

    public boolean isSelect() {
        return select;
    }

    public boolean isUpdate() {
        return update;
    }

    public boolean isDelete() {
        return delete;
    }

    public String getEmail() {
        return email;
    }

    public users(String name, String pwd,String email, boolean select, boolean update, boolean delete) {
        this.name = name;
        this.pwd = pwd;
        this.email = email;
        this.select = select;
        this.update = update;
        this.delete = delete;
    }
}
