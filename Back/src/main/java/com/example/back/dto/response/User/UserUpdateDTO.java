package com.example.back.dto.response.User;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateDTO {
    String userName;
    String email;
//    String password;
    String gender;
    LocalDate dob;
}
