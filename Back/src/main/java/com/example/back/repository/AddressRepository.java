package com.example.back.repository;

import com.example.back.entity.Address;
import com.example.back.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {
    List<Address> findByUser(User user);
    Optional<Address> findById(Integer id);
    @Modifying
    @Query("UPDATE Address a set a.isDefault = false where a.user.id = :userId")
    void UpdateAllToNonDefault(@Param("userId") Integer userId);

}
