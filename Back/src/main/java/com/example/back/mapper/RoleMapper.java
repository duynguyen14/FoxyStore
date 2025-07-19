package com.example.back.mapper;


import com.example.back.dto.response.User.RoleDTO;
import com.example.back.entity.Role;

import java.util.stream.Collectors;

public class RoleMapper {

    public static RoleDTO toDTO(Role role) {
        if (role == null) return null;

        return RoleDTO.builder()
                .roleId(role.getRoleId())
                .roleName(role.getRoleName())
                .description(role.getDescription())
                // Có thể thêm users nếu cần, nhưng hay gây vòng lặp vô hạn -> nên tránh hoặc làm DTO riêng biệt
                .build();
    }

    public static Role toEntity(RoleDTO dto) {
        if (dto == null) return null;

        Role role = Role.builder()
                .roleId(dto.getRoleId())
                .roleName(dto.getRoleName())
                .description(dto.getDescription())
                .build();

        // Không set users ở đây để tránh vòng lặp

        return role;
    }
}
