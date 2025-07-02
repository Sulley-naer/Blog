package org.naer.blog.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class captchaRequest {
    @NotNull
    @NotBlank
    private String email;
}
