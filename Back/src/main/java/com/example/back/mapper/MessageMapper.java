package com.example.back.mapper;

import com.example.back.dto.response.Message.MessageDTO;
import com.example.back.entity.Message;
import org.springframework.stereotype.Component;

@Component
public class MessageMapper {
    public Message toMessage(MessageDTO messageDTO){
        return Message.builder()
                .message(messageDTO.getMessage())
                .time(messageDTO.getTime())
                .build();
    }
    public MessageDTO messageDTO(Message message){
        return MessageDTO.builder()
                .fromUser(message.getFromUser().getUserName())
                .toUser(message.getToUser().getUserName())
                .message(message.getMessage())
                .time(message.getTime())
                .build();
    }
}
