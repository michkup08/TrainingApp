package com.example.trainingServer.controller;

import com.example.trainingServer.DTO.ChatDTO;
import com.example.trainingServer.DTO.MessageDTO;
import com.example.trainingServer.entities.Chat;
import com.example.trainingServer.entities.Message;
import com.example.trainingServer.mapper.ChatMapper;
import com.example.trainingServer.repositories.ChatRepository;
import com.example.trainingServer.repositories.MessageRepository;
import com.example.trainingServer.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import com.example.trainingServer.mapper.MessageMapper;

import java.util.Optional;

@Controller
public class ChatsWSController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatRepository chatRepository;
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageMapper messageMapper;

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public MessageDTO receivePublicMessage(@Payload MessageDTO messageDTO) {
        return messageDTO;
    }

    @MessageMapping("/private-message")
    public MessageDTO receivePrivateMessage(@Payload MessageDTO messageDTO) {
        Optional<Chat> chat = chatRepository.findByUsers(messageDTO.getReceiverId(), messageDTO.getSenderId());
        if (chat.isPresent()) {
            Message newMessage = messageMapper.toEntity(messageDTO);
            newMessage.setChat(chat.get());
            messageRepository.save(newMessage);
        }
        else {
            Chat newChat = new Chat(userRepository.findByUserId(messageDTO.getSenderId()), userRepository.findByUserId(messageDTO.getReceiverId()), "");
            chatRepository.saveAndFlush(newChat);
            Message newMessage = messageMapper.toEntity(messageDTO);
            newMessage.setChat(newChat);
            messageRepository.save(newMessage);
        }
        messagingTemplate.convertAndSendToUser(""+messageDTO.getReceiverId(), "/private", messageDTO);
        return messageDTO;
    }

}
