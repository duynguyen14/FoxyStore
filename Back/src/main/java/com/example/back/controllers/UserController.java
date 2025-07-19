package com.example.back.controllers;

import com.example.back.dto.request.User.PasswordUpdate;
import com.example.back.dto.request.User.UserLoginDTO;
import com.example.back.dto.request.User.UserRegister;
import com.example.back.dto.response.APIResponse;
import com.example.back.dto.response.User.*;
import com.example.back.entity.Role;
import com.example.back.entity.User;
import com.example.back.mapper.UserMapper;
import com.example.back.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.key}")
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
//@CrossOrigin(origins = "*")
public class UserController {
    UserService userService;
    UserMapper userMapper;
    @PostMapping("/user/register")
    public APIResponse<UserRegisterResponse> createUser(@RequestBody @Valid UserRegister userRegister){
        return APIResponse.<UserRegisterResponse>builder()
                .result(userService.createUser(userRegister))
                .build();
    }
    @PostMapping("user/login")
    public APIResponse<UserLoginResponse> loginUser(@RequestBody @Valid UserLoginDTO userLoginDTO){
        return APIResponse.<UserLoginResponse>builder()
                .result(userService.loginUser(userLoginDTO))
                .build();
    }
    @GetMapping("user/profile")
    public APIResponse<UserUpdateDTO> getUserProfile(){
        return APIResponse.<UserUpdateDTO>builder()
                .result(userService.getUserInformation())
                .build();
    }
    @PatchMapping("user/profile")
    public APIResponse<String> updateUser(@RequestBody @Valid UserUpdateDTO userUpdateDTO){
        return APIResponse.<String>builder()
                .result(userService.updateUser(userUpdateDTO))
                .build();
    }
    @PostMapping("user/change-password")
    public APIResponse<String> updatePassword(@RequestBody @Valid PasswordUpdate passwordUpdate){
        return APIResponse.<String>builder()
                .result(userService.updatePassword(passwordUpdate))
                .build();
    }
    @GetMapping("/admin/getAll")
    public APIResponse<List<UserDTO>> getAllUsers() {
        return APIResponse.<List<UserDTO>>builder()
                .result(userService.getAllUsers())
                .build();
    }
    @GetMapping("admin/user/{id}")
    public APIResponse<UserDTO> getUserById(@PathVariable Integer id) {
        return APIResponse.<UserDTO>builder()
                .result(userService.getUserById(id))
                .build();
    }

    @PutMapping("/admin/user/{id}/status")
    public ResponseEntity<String> updateStatus(
            @PathVariable Integer id,
            @RequestBody UserDTO request) {
        userService.updateUserStatus(id, request.getStatus());
        return ResponseEntity.ok("User status updated successfully");
    }

    @PutMapping("/admin/user/{id}/role")
    public ResponseEntity<UserDTO> updateUserRoles(
            @PathVariable Integer id,
            @RequestBody UpdateRole request) {

        User updatedUser = userService.updateUserRoles(id, request.getRoleIds());

        return ResponseEntity.ok(userMapper.toUserDTO(updatedUser));
    }
}
