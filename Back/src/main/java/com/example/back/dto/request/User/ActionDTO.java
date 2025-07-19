package com.example.back.dto.request.User;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ActionDTO {
//    Integer UserId;
    Integer productId;
    String action;
    String sessionId;
}
