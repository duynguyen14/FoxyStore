package com.example.back.controllers;

import com.example.back.dto.request.User.ActionDTO;
import com.example.back.dto.response.APIResponse;
import com.example.back.entity.Behavior;
import com.example.back.service.BehaviorService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.key}/behavior")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class BehaviorController {
    BehaviorService behaviorService;

    @PostMapping("/create")
    public APIResponse<Behavior> createBehavior(@RequestBody @Valid ActionDTO actionDTO){
        return APIResponse.<Behavior>builder()
                .result(behaviorService.createBehavior(actionDTO))
                .build();
    }

    @GetMapping("/user/{userId}")
    public APIResponse<List<Behavior>> getByUser(@PathVariable Integer userId){
        return APIResponse.<List<Behavior>>builder()
                .result(behaviorService.getByUserId(userId))
                .build();
    }
}
