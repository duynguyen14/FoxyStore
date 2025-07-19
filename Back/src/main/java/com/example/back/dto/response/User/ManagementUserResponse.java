package com.example.back.dto.response.User;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ManagementUserResponse {
    String userName;
    String email;
    String status;
    String roleName;
    String gender;
    LocalDate dob;
}
