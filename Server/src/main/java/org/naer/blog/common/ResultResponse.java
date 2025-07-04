package org.naer.blog.common;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResultResponse<T> {
    private int code;
    private String message;
    private T data;

    public ResultResponse(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
