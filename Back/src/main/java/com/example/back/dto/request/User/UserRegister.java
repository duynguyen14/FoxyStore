package com.example.back.dto.request.User;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRegister {
    @NotBlank(message = "USER_NAME_IS_REQUIRED")
    String userName;
    @Email(message = "EMAIL_INVALID")
    @NotBlank(message = "EMAIL_IS_REQUIRED")
    String email;
    @NotBlank(message = "PASSWORD_IS_REQUIRED")
    String password;
}
