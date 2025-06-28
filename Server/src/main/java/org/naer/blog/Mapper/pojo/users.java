package org.naer.blog.Mapper.pojo;

import lombok.Data;

@SuppressWarnings("LombokGetterMayBeUsed")
@Data
public class users {
    private int id;
    private String name;
    private String pwd;
    private boolean select;
    private boolean update;
    private boolean delete;

    public boolean isSelect() {
        return select;
    }

    public boolean isUpdate() {
        return update;
    }

    public boolean isDelete() {
        return delete;
    }
}
