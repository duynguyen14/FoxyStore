package com.example.back.mapper;

import com.example.back.dto.request.User.ActionDTO;
import com.example.back.entity.Behavior;
import com.example.back.enums.ActionUser;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class BehaviorMapper {
    public Behavior fromActionDTO(ActionDTO actionDTO) {
        ActionUser actionUser = ActionUser.getByAction(actionDTO.getAction());
        return Behavior.builder()
//                .UserId(actionDTO.getUserId())
                .productId(actionDTO.getProductId())
                .action(actionUser.getAction())
                .action_value(actionUser.getScore())
                .time(LocalDateTime.now())
                .sessionId(actionDTO.getSessionId())
                .build();
    }
}
