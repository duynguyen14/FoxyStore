package com.example.back.controllers;

import com.example.back.dto.request.Review.ReviewDTO;
import com.example.back.dto.response.APIResponse;
import com.example.back.dto.response.Review.ReviewDTOResponse;
import com.example.back.dto.response.Review.ReviewDetail;
import com.example.back.service.ReviewService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import com.example.back.dto.response.APIResponse;
import com.example.back.dto.response.Bill.RecentBillDTO;
import com.example.back.dto.response.Review.ReviewRespone;
import com.example.back.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("${api.key}/reviews")
@RequiredArgsConstructor

@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ReviewController {
   ReviewService reviewService;

    @GetMapping("/recent")
    public APIResponse<List<ReviewRespone>> getRecentReviews(
            @RequestParam(defaultValue = "10") int limit) {
            List<ReviewRespone> reviews = reviewService.getRecentReviews(limit);
            return APIResponse.<List<ReviewRespone>>builder()
                    .result(reviews)
                    .build();
    }


    @GetMapping("/check/{id}")
    public APIResponse<Boolean> checkUserReview(@PathVariable Integer id){
        return APIResponse.<Boolean>builder()
                .result(reviewService.checkUserCanReview(id))
                .build();
    }
    @PostMapping("/create/{id}")
    public APIResponse<ReviewDetail> createReview(@PathVariable Integer id, @RequestBody @Valid ReviewDTO reviewDTO){
        return APIResponse.<ReviewDetail>builder()
                .result(reviewService.addReview(id,reviewDTO))
                .build();
    }
    @GetMapping("/admin")
    public List<ReviewDTOResponse> getAllReviews() {
        return reviewService.getAllReviews();
    }

    @PutMapping("/{id}/admin/reply")
    public ResponseEntity<ReviewDTOResponse> replyToReview(
            @PathVariable Integer id,
            @RequestBody Map<String, String> payload
    ) {
        String reply = payload.get("reply");
        ReviewDTOResponse updatedReview = reviewService.updateReply(id, reply);
        return ResponseEntity.ok(updatedReview);
    }


}
