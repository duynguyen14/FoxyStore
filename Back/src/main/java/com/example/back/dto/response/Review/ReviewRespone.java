package com.example.back.dto.response.Review;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewRespone {
    String customerName;
    Integer rating;
    LocalDateTime reviewDate;
    String reviewContent;
    String productName;
}
