package com.example.back.service;

import com.example.back.dto.request.User.PasswordUpdate;
import com.example.back.dto.request.User.UserLoginDTO;
import com.example.back.dto.request.User.UserRegister;
import com.example.back.dto.response.User.*;
import com.example.back.entity.Role;
import com.example.back.entity.User;
import com.example.back.enums.ErrorCodes;
import com.example.back.exception.AppException;
import com.example.back.mapper.UserMapper;
import com.example.back.repository.BehaviorRepository;
import com.example.back.repository.RoleRepository;
import com.example.back.repository.UserRepository;
import com.example.back.security.JWTUntil;
import com.example.back.security.user.UserPrincipal;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;
    JWTUntil jwtUntil;
    BehaviorRepository behaviorRepository;
    User findByUserId(){
        Integer userId = Integer.parseInt(SecurityContextHolder.getContext().getAuthentication().getName());
        return userRepository.findById(userId).orElseThrow(()-> new AppException(ErrorCodes.USER_NOT_FOUND));
    }
    public UserRegisterResponse createUser(UserRegister userRegister){
        if(userRepository.existsByEmail(userRegister.getEmail())){
            throw new AppException(ErrorCodes.USER_EXISTED);
        }
        User user = userMapper.fromUserRegisterDTO(userRegister);
        user.setPassword(passwordEncoder.encode(userRegister.getPassword()));
        user.setEmailVerified(Boolean.TRUE);
        HashSet<Role> roles =new HashSet<>();
        Role role=roleRepository.findByRoleName("USER").orElseThrow(()->new AppException(ErrorCodes.ROLE_NOT_FOUND));
        roles.add(role);
        user.setRoles(roles);
        userRepository.save(user);
        return userMapper.toUserRegisterResponse(user);
    }

    @Transactional
    public UserLoginResponse loginUser(UserLoginDTO userLoginDTO){
        User user =userRepository.findByEmail(userLoginDTO.getEmail()).orElseThrow(()->new AppException(ErrorCodes.USER_NAME_OR_PASSWORD_INCORRECT));
        if(!passwordEncoder.matches(userLoginDTO.getPassword(), user.getPassword())){
            throw (new AppException(ErrorCodes.USER_NAME_OR_PASSWORD_INCORRECT));
        }
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        String accessToken = jwtUntil.GenerateAccessToken(userPrincipal);
        String refreshToken =null;

//         update action guest
        behaviorRepository.assignSessionToUser(userLoginDTO.getSessionId(), user.getId());
        return UserLoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }
    public UserUpdateDTO getUserInformation(){
        User user =findByUserId();
        return userMapper.toUserUpdateDTO(user);
    }
    public String updateUser(UserUpdateDTO userUpdateDTO){
        User user =findByUserId();
        userMapper.UpdateUser(user,userUpdateDTO);
//        passwordEncoder.encode(user.getPassword());
        userRepository.save(user);
        UserPrincipal userPrincipal =UserPrincipal.create(user);
        return "updateUser successful";
    }
    public String updatePassword(PasswordUpdate passwordUpdate){
        User user =findByUserId();
        if(!passwordEncoder.matches(passwordUpdate.getOldPassword(), user.getPassword())){
            throw new AppException(ErrorCodes.PASSWORD_INCORRECT);
        }
        user.setPassword(passwordEncoder.encode(passwordUpdate.getNewPassword()));
        userRepository.save(user);
        return "update password successfully";
    }
    public List<ManagementUserResponse> managementUserResponses(){
        List<User> users =userRepository.findAll();
        return users.stream().map(userMapper::toManagementUserResponse).toList();
    }
    public List<UserDTO> getAllUsers() {
        return userRepository.getAllUserWithRole().stream()
                .map(userMapper::toUserDTO)
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCodes.USER_NOT_FOUND));
        return userMapper.toUserDTO(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public void updateUserStatus(Integer userId, String newStatus) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodes.USER_NOT_FOUND));
        user.setStatus(newStatus);
        userRepository.save(user);
    }

    @Transactional
    public User updateUserRoles(Integer userId, Set<Integer> roleIds) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodes.USER_NOT_FOUND));

        Set<Role> roles = new HashSet<>(roleRepository.findAllById(roleIds));

        if (roles.isEmpty()) {
            throw new AppException(ErrorCodes.ROLE_NOT_FOUND);
        }

        user.setRoles(roles);
        return userRepository.save(user);
    }
}
