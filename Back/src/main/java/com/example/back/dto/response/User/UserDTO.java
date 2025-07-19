package com.example.back.dto.response.User;

import com.example.back.entity.User;
import lombok.*;

import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Integer id;
    private String email;
    private String userName;
    private String status;
    private String gender;
    private LocalDate dob;
    private Set<RoleDTO> roles;

    public static UserDTO fromEntity(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .userName(user.getUserName())
                .status(user.getStatus())
                .gender(user.getGender())
                .dob(user.getDob())
                .roles(user.getRoles().stream()
                        .map(role -> RoleDTO.builder()
                                .roleId(role.getRoleId())
                                .roleName(role.getRoleName())
                                .description(role.getDescription())
                                .build())
                        .collect(Collectors.toSet()))
                .build();
    }
}
