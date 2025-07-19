package com.example.back.repository;

import com.example.back.entity.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SizeRepository extends JpaRepository<Size,Integer> {
    Optional<Size> findBySizeNameIgnoreCase(String sizeName);
    Optional<Size> findBySizeName(String sizeName);
}
