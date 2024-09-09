package com.example.trainingServer.controller;

import com.example.trainingServer.DTO.MessageDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatsController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public MessageDTO receivePublicMessage(@Payload MessageDTO messageDTO) {
        return messageDTO;
    }

    @MessageMapping("/private-message")
    public MessageDTO receivePrivateMessage(@Payload MessageDTO messageDTO) {
        messagingTemplate.convertAndSendToUser(messageDTO.getReceiverName()/*""+messageDTO.getReceiverId()*/, "/private", messageDTO);
        return messageDTO;
    }
}
