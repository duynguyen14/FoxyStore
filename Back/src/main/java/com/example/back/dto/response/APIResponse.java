package com.example.back.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class APIResponse<T> {
    @Builder.Default
    int code=1000;
    String message;
    T result;
    public static <T> APIResponse<T> notFound() {
        return APIResponse.<T>builder()
                .code(404)
                .message("Not Found")
                .result(null)
                .build();
    }

    public static <T> APIResponse<T> success(T result) {
        return APIResponse.<T>builder()
                .code(1000)
                .message("Success")
                .result(result)
                .build();
    }
    public static <T> APIResponse<T> error(String message) {
        return APIResponse.<T>builder()
                .code(9999)
                .message(message)
                .build();
    }
}
