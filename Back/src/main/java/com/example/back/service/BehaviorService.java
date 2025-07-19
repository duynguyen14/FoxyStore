package com.example.back.service;

import com.example.back.dto.request.User.ActionDTO;
import com.example.back.entity.Behavior;
import com.example.back.mapper.BehaviorMapper;
import com.example.back.repository.BehaviorRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class BehaviorService {
    BehaviorRepository behaviorRepository;
    BehaviorMapper behaviorMapper;
    Integer getCurrentUserId(){
        try {
            String principal = SecurityContextHolder.getContext().getAuthentication().getName();
            if (principal.equals("anonymousUser")) return null;
            return Integer.parseInt(principal);
        } catch (Exception e) {
            return null;
        }
    }
    public Behavior createBehavior(ActionDTO actionDTO)  {
        Behavior behavior = behaviorMapper.fromActionDTO(actionDTO);
        behavior.setUserId(getCurrentUserId());
        return behaviorRepository.save(behavior);
    }

    public List<Behavior> getByUserId(Integer userId){
        return behaviorRepository.getByUserId(userId);
    }
}
