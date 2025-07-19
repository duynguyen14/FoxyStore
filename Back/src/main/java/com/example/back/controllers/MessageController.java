package com.example.back.controllers;

import com.example.back.dto.response.Message.MessageDTO;
import com.example.back.entity.Message;
import com.example.back.service.MessageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
@RestController
@RequestMapping("${api.key}/message")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class MessageController {
    MessageService messageService;
    SimpMessagingTemplate simpMessagingTemplate;
    @GetMapping("/admin")
    public List<MessageDTO> getAll(){
        return messageService.getAll("admin","duydz");
    }

//gửi tin nhắn lại cho chính người gui
    @MessageMapping("/chat")
    @SendToUser("/topic/message")
    public Message chat(MessageDTO messageDTO){
        return messageService.saveMessage(messageDTO);
    }

//    gửi tin nhắn đến cho người được chỉ định
    @MessageMapping("/private-message")
    public void sendMessagePrivate(MessageDTO messageDTO){
        messageService.saveMessage(messageDTO);
        simpMessagingTemplate.convertAndSendToUser(messageDTO.getToUser(),"/topic/message",messageDTO);
    }
}
