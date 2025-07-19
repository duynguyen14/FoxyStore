package com.example.back.repository;

import com.example.back.entity.Message;
import com.example.back.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {

    @Query("SELECT m FROM Message m WHERE (m.fromUser =:user1 AND m.toUser =:user2) OR (m.fromUser =:user2 AND m.toUser =:user1) ORDER BY m.time ASC")
    List<Message> findConversation(@Param("user1") User fromUser, @Param("user2") User toUser);
}
