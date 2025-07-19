package com.example.back.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    String message;

    LocalDateTime time;

    @ManyToOne
    @JoinColumn(name = "from_user_id")
    User fromUser;

    @ManyToOne
    @JoinColumn(name = "to_user_id")
    User toUser;
}
