package com.example.back.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ROLE")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Role {
    @Id
    @Column(name = "RoleId")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer roleId;

    @Column(name = "RoleName")
    String roleName;

    @Column(name = "Description")
    String description;

    @ManyToMany(mappedBy = "roles")
    List<User> users;
}
