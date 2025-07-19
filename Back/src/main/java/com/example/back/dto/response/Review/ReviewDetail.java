package com.example.back.dto.response.Review;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewDetail {
    Integer id;
    String comment;
    Integer rating;
    LocalDateTime date;
    String userName;
    String reply;
}
