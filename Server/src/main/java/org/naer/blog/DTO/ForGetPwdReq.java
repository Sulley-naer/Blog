package org.naer.blog.DTO;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ForGetPwdReq {
    @NotNull
    @NotEmpty
    String user;

    @NotNull
    @NotEmpty
    String email;

    @NotNull
    @NotEmpty
    String pwd;

    String captcha;
}
