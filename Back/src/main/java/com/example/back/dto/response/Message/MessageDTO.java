package com.example.back.dto.response.Message;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class    MessageDTO {
    String fromUser;
    String toUser;
    String message;
    LocalDateTime time;
}
