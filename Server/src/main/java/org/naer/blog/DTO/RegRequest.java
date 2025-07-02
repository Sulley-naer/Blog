package org.naer.blog.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegRequest {
    @NotBlank
    @NotNull
    String name;

    @NotBlank
    @NotNull
    String pwd;

    @NotBlank
    @NotNull
    String email;

    @NotBlank
    @NotNull
    String captcha;
}
