package com.example.back.dto.response.Review;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDTOResponse {
    private Integer reviewId;
    private String comment;
    private Integer rating;
    private String userName;
    private Integer productId;
    private String productName;
    LocalDateTime date;
    private String reply;
}
