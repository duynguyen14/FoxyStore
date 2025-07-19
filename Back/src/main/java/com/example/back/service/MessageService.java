package com.example.back.service;

import com.example.back.dto.response.Message.MessageDTO;
import com.example.back.entity.Message;
import com.example.back.entity.User;
import com.example.back.enums.ErrorCodes;
import com.example.back.exception.AppException;
import com.example.back.mapper.MessageMapper;
import com.example.back.repository.MessageRepository;
import com.example.back.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor()
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class MessageService {
    UserRepository userRepository;
    MessageRepository messageRepository;
    MessageMapper messageMapper;

    public Message saveMessage(MessageDTO messageDTO){
        Message message = messageMapper.toMessage(messageDTO);
        User fromUser = userRepository.findByUserName(messageDTO.getFromUser()).orElseThrow(()-> new AppException(ErrorCodes.USER_NOT_FOUND));
        User toUser =userRepository.findByUserName(messageDTO.getToUser()).orElseThrow(()-> new AppException(ErrorCodes.USER_NOT_FOUND));
        message.setFromUser(fromUser);
        message.setToUser(toUser);
        return messageRepository.save(message);
    }
    public List<MessageDTO> getAll(String fromUser, String toUser){
        User sender =userRepository.findByUserName(fromUser).orElseThrow(()-> new AppException(ErrorCodes.USER_NOT_FOUND));
        User receiver =userRepository.findByUserName(toUser).orElseThrow(()-> new AppException(ErrorCodes.USER_NOT_FOUND));
        return messageRepository.findConversation(sender,receiver).stream().map(messageMapper::messageDTO).toList();
    }
//    public String getUser(){
//        User user =userRepository.findByUserName("duydz").orElseThrow(()-> new AppException())
//    }
}
