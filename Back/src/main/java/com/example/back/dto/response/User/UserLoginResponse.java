package com.example.back.dto.response.User;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Getter
@Setter
@FieldDefaults(level =  AccessLevel.PRIVATE)
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginResponse {
    String accessToken;
    String refreshToken;
    

}
