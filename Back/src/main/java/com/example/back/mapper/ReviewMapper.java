package com.example.back.mapper;

import com.example.back.dto.request.Review.ReviewDTO;
import com.example.back.dto.response.Review.ReviewDetail;
import com.example.back.entity.Review;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class ReviewMapper {
    public ReviewDetail toReviewDetail(Review review){
        return  ReviewDetail.builder()
                .id(review.getReviewId())
                .comment(review.getComment())
                .rating(review.getRating())
                .date(review.getTime())
                .userName(review.getUser().getUserName())
                .reply(review.getReply())
                .build();
    }
    public void mapToReviewFromReviewDTO(ReviewDTO reviewDTO, Review review){
        review.setComment(reviewDTO.getComment());
        review.setRating(reviewDTO.getRating());
        review.setTime(LocalDateTime.now());
    }
}
