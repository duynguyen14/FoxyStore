package com.example.back.mapper;

import com.example.back.dto.request.User.UserRegister;
import com.example.back.dto.response.User.*;
import com.example.back.entity.Role;
import com.example.back.entity.User;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.stream.Collectors;
@Component
public class UserMapper {
    public  User fromUserRegisterDTO(UserRegister userRegister){
        return User.builder()
                .email(userRegister.getEmail())
                .userName(userRegister.getUserName())
                .password(userRegister.getPassword())
                .build();
    }
    public UserRegisterResponse toUserRegisterResponse(User user){
        return  UserRegisterResponse.builder()
                .email(user.getEmail())
                .userName(user.getUserName())
                .build();
    }
    public ManagementUserResponse toManagementUserResponse(User user){
        return  ManagementUserResponse.builder()
                .dob(user.getDob())
                .status(user.getStatus()==null ?"Hoạt động" :user.getStatus())
                .gender(user.getGender()==null ? "": user.getGender())
                .email(user.getEmail())
                .userName(user.getUserName())
                .roleName(user.getRoles().stream().map(Role::getRoleName).findFirst().orElse(null))
                .build();
    }
    public UserUpdateDTO toUserUpdateDTO(User user){
        return UserUpdateDTO.builder()
                .userName(user.getUserName())
                .dob(user.getDob())
                .email(user.getEmail())
                .gender(user.getGender())
//                .password(user.getPassword())
                .build();
    }
    public void UpdateUser(User user, UserUpdateDTO userUpdateDTO){
        user.setUserName(userUpdateDTO.getUserName());
//        user.setPassword(userUpdateDTO.getPassword());
        user.setEmail(userUpdateDTO.getEmail());
        user.setGender(userUpdateDTO.getGender());
        user.setDob(userUpdateDTO.getDob());
    }
    public UserDTO toUserDTO(User user){
        if(user == null) return null;

        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .userName(user.getUserName())
                .status(user.getStatus())
                .gender(user.getGender())
                .dob(user.getDob())
                .roles(user.getRoles() != null ?
                        user.getRoles().stream()
                                .map(role -> RoleDTO.builder()
                                        .roleId(role.getRoleId())
                                        .roleName(role.getRoleName())
                                        .description(role.getDescription())
                                        .build())
                                .collect(Collectors.toSet())
                        : Collections.emptySet())
                .build();
    }

    // Mapper UserDTO -> User entity (update thông tin)
    public User toUserEntity(UserDTO userDTO){
        if(userDTO == null) return null;

        User user = User.builder()
                .id(userDTO.getId())
                .email(userDTO.getEmail())
                .userName(userDTO.getUserName())
                .status(userDTO.getStatus())
                .gender(userDTO.getGender())
                .dob(userDTO.getDob())
                .build();

        // Nếu cần set roles ở đây thì xử lý thêm

        return user;
    }
}
