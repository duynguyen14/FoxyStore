package com.example.back.repository;

import com.example.back.entity.Behavior;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface BehaviorRepository extends JpaRepository<Behavior,Integer> {

    List<Behavior>getByUserId(Integer userId);

    List<Behavior> findBySessionId(String sessionId);


    @Modifying
    @Query("update Behavior b set b.userId = :userId where b.sessionId = :sessionId AND b.userId is NULL")
    void assignSessionToUser(@Param("sessionId") String sessionId, @Param("userId")Integer userId);
}
