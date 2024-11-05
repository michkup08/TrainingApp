package com.example.trainingServer.controller;

import com.example.trainingServer.DTO.ChatDTO;
import com.example.trainingServer.DTO.MessageDTO;
import com.example.trainingServer.entities.Chat;
import com.example.trainingServer.entities.Message;
import com.example.trainingServer.mapper.ChatMapper;
import com.example.trainingServer.repositories.ChatRepository;
import com.example.trainingServer.repositories.MessageRepository;
import com.example.trainingServer.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import com.example.trainingServer.mapper.MessageMapper;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Controller
@AllArgsConstructor
public class ChatsWSController {
    private final SimpMessagingTemplate messagingTemplate;

    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    private final MessageMapper messageMapper;

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public ResponseEntity<MessageDTO> receivePublicMessage(@Payload MessageDTO messageDTO) {
        return ResponseEntity.ok(messageDTO);
    }

    @MessageMapping("/private-message")
    public ResponseEntity<MessageDTO> receivePrivateMessage(@Payload MessageDTO messageDTO) {
        LocalDateTime currentDateTime = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
        Optional<Chat> chat = chatRepository.findByUsers(messageDTO.getReceiverId(), messageDTO.getSenderId());
        if (chat.isPresent()) {
            Chat chatForUpdate = chat.get();
            Message newMessage = messageMapper.toEntity(messageDTO);
            newMessage.setChat(chatForUpdate);
            messageRepository.save(newMessage);
            chatForUpdate.setLastMessageDate(currentDateTime.format(formatter));
            if(chatForUpdate.getUserOne().getUserId()==messageDTO.getSenderId()){
                chatForUpdate.setUserTwoNotification(true);
            }
            else {
                chatForUpdate.setUserOneNotification(true);
            }
            chatRepository.saveAndFlush(chatForUpdate);
        }
        else {
            Chat newChat = new Chat(userRepository.findByUserId(messageDTO.getSenderId()), userRepository.findByUserId(messageDTO.getReceiverId()), "");
            newChat.setLastMessageDate(currentDateTime.format(formatter));
            if(newChat.getUserOne().getUserId()==messageDTO.getSenderId()){
                newChat.setUserTwoNotification(true);
            }
            else {
                newChat.setUserOneNotification(true);
            }
            chatRepository.saveAndFlush(newChat);
            Message newMessage = messageMapper.toEntity(messageDTO);
            newMessage.setChat(newChat);
            messageRepository.save(newMessage);
        }
        messagingTemplate.convertAndSendToUser(""+messageDTO.getReceiverId(), "/private", messageDTO);
        return ResponseEntity.ok(messageDTO);
    }

}
