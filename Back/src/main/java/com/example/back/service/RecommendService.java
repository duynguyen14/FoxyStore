package com.example.back.service;

import com.example.back.dto.response.Product.ProductHome;
import com.example.back.dto.response.Product.Recommend;
import com.example.back.dto.response.Product.RecommendResponse;
import com.example.back.entity.Behavior;
import com.example.back.entity.Product;
import com.example.back.entity.User;
import com.example.back.enums.ErrorCodes;
import com.example.back.exception.AppException;
import com.example.back.mapper.ProductMapper;
import com.example.back.repository.BehaviorRepository;
import com.example.back.repository.ProductRepository;
import com.example.back.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Collections;
import java.util.List;
@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class RecommendService {
    UserRepository userRepository;
    ProductRepository productRepository;
    RestTemplate restTemplate;
    ProductMapper productMapper;
    BehaviorRepository behaviorRepository;
    @NonFinal
    @Value("${ai.api.url}")
    String url;
    public String getUserKey(String sessionId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            return auth.getName(); // chính là userId
        } else if (sessionId != null) {
            return sessionId;
        } else {
            return null;
        }
    }

    public List<ProductHome> getRecommend(String sessionId){
        String userKey = getUserKey(sessionId);
        if (userKey == null) {
            log.info("không tìm thấy user id or sessionId");
            return Collections.emptyList();
        }
        List<Behavior> behaviors = behaviorRepository.findBySessionId(sessionId);
        if(behaviors.isEmpty()){
            log.info("Behaviors is empty");
            return Collections.emptyList();
        }

        RecommendResponse recommendResponse = restTemplate.getForObject(url+userKey, RecommendResponse.class);
        if(recommendResponse==null || recommendResponse.getProductIds().isEmpty()){
            log.info("không lấy được danh sách hoặc danh sách rỗng");
            return Collections.emptyList();
        }
        List<Integer> productIds = recommendResponse.getProductIds();
        List<Product> products = productRepository.findByProductIds(productIds);
        return products.stream().map(productMapper::toProductHomeDTO).toList();
    }

    @Scheduled(fixedRate = 30*60*1000)
    public void TrainAI(){
        try{
            String response = restTemplate.getForObject(url+"ai/train", String.class);
            log.info("response: {}",response);
        }
        catch(Exception e){
            log.error("loi "+e);
        }

    }
}
