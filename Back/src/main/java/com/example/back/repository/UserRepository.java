package com.example.back.repository;

import com.example.back.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;
public interface UserRepository extends JpaRepository<User,Integer> {
//    boolean existsByPhoneNumber(String phoneNumber);
    Optional<User> findById(Integer id);

    boolean existsByEmail(String email);
    // Các hàm cần thiết tự thêm nhé

//    @Override
//    Optional<User> findByName(String  name);
    Optional<User> findByEmail(String email);
    Optional<User> findByUserName(String userName);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.email = :email")
    Optional<User> findByEmailWithRoles(@Param("email") String email);
    @Query("SELECT u FROM User u JOIN FETCH u.roles")
    List<User> getAllUserWithRole();
}
