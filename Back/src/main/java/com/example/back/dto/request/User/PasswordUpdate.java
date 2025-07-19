package com.example.back.dto.request.User;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PasswordUpdate {
    String oldPassword;
    String newPassword;
}
