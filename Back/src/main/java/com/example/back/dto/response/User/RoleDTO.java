package com.example.back.dto.response.User;


import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleDTO {
    private Integer roleId;
    private String roleName;
    private String description;
}
