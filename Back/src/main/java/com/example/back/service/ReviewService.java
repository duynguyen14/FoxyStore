package com.example.back.service;

import com.example.back.dto.request.Review.ReviewDTO;
import com.example.back.dto.response.Review.ReviewDTOResponse;
import com.example.back.dto.response.Review.ReviewDetail;
import com.example.back.dto.response.Review.ReviewRespone;
import com.example.back.entity.Product;
import com.example.back.entity.Review;
import com.example.back.entity.User;
import com.example.back.enums.BillStatus;
import com.example.back.enums.ErrorCodes;
import com.example.back.exception.AppException;
import com.example.back.mapper.ReviewMapper;
import com.example.back.repository.BillRepository;
import com.example.back.repository.ProductRepository;
import com.example.back.repository.ReviewRepository;
import com.example.back.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ReviewService {
    ReviewRepository reviewRepository;
    UserRepository userRepository;
    BillRepository billRepository;
    ProductRepository productRepository;
    ReviewMapper reviewMapper;
    User getCurrentUser() {
        Integer userId = Integer.parseInt(SecurityContextHolder.getContext().getAuthentication().getName());
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodes.USER_NOT_FOUND));
    }
    public List<ReviewRespone> getRecentReviews(int limit) {
        try {
            Pageable pageable = PageRequest.of(0, limit);
            List<Review> reviews = reviewRepository.findRecentReviews(pageable);

            if (reviews.isEmpty()) {
                throw new RuntimeException("Không có đánh giá nào gần đây");
            }

            return reviews.stream()
                    .map(review -> ReviewRespone.builder()
                            .customerName(review.getUser().getUserName())
                            .rating(review.getRating())
                            .reviewDate(review.getTime())
                            .reviewContent(review.getComment())
                            .productName(review.getProduct().getName())
                            .build())
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lấy đánh giá gần đây: " + e.getMessage(), e);
        }
    }



    public Boolean checkUserCanReview(Integer id) {
        User user = getCurrentUser();
        String status = BillStatus.SHIPPED.getLabel();
        List<Integer> productIds = billRepository.getProductInBillByUser(user, status);
        for (Integer productId : productIds) {
            if (productId.equals(id)) {
                return Boolean.TRUE;

            }
        }
        return Boolean.FALSE;
    }

    @jakarta.transaction.Transactional
    public ReviewDetail addReview(Integer id, ReviewDTO reviewDTO) {
        User user = getCurrentUser();
        Product product = productRepository.findByProductId(id).orElseThrow(() -> new AppException(ErrorCodes.PRODUCT_NOT_FOUND));
        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        reviewMapper.mapToReviewFromReviewDTO(reviewDTO, review);
        reviewRepository.save(review);
        return reviewMapper.toReviewDetail(review);
    }

    @Transactional(readOnly = true)
    public List<ReviewDTOResponse> getAllReviews() {
        return reviewRepository.findAllWithUserAndProduct().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

    }
    public ReviewDTOResponse updateReply (Integer reviewId, String reply){
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new EntityNotFoundException("Review not found"));
        review.setReply(reply);
        reviewRepository.save(review);
        return convertToDTO(review);
    }
    private ReviewDTOResponse convertToDTO (Review r){
        return ReviewDTOResponse.builder()
                    .reviewId(r.getReviewId())
                    .comment(r.getComment())
                    .rating(r.getRating())
                    .date(r.getTime())
                    .userName(r.getUser() != null ? r.getUser().getUserName() : "N/A")
                    .productId(r.getProduct() != null ? r.getProduct().getProductId().intValue() : null)
                    .productName(r.getProduct() != null ? r.getProduct().getName() : "N/A")
                    .reply(r.getReply())
                    .build();
    }
}
