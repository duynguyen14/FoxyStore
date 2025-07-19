package com.example.back.repository;

import com.example.back.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

//    boolean existsBy(Integer integer);
    Optional<Role> findByRoleName(String roleName);
}

