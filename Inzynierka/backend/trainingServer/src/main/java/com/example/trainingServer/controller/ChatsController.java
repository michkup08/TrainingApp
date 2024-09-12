package com.example.trainingServer.controller;

import com.example.trainingServer.DTO.ChatDTO;
import com.example.trainingServer.DTO.MessageDTO;
import com.example.trainingServer.entities.Chat;
import com.example.trainingServer.entities.Message;
import com.example.trainingServer.mapper.ChatMapper;
import com.example.trainingServer.repositories.ChatRepository;
import com.example.trainingServer.repositories.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import com.example.trainingServer.mapper.MessageMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/chats")
public class ChatsController {

    @Autowired
    private ChatRepository chatRepository;
    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private MessageMapper messageMapper;
    @Autowired
    private ChatMapper chatMapper;


    @GetMapping("/chatsSimplified/{userId}")
    public List<ChatDTO> chatsSimplified(@PathVariable long userId) {
        List<Chat> chats = chatRepository.findByUser(userId);
        List<ChatDTO> chatDTOs = new ArrayList<>();
        for (Chat chat : chats) {
            chatDTOs.add(chatMapper.toDTO(chat));
        }
        return chatDTOs;
    }

    @GetMapping("/messagesHistory/{chatId}")
    public List<MessageDTO> messageHistory(@PathVariable long chatId) {
        List<Message> messages = messageRepository.findByChat(chatRepository.findById(chatId).get());
        List<MessageDTO> messageDTOs = new ArrayList<>();
        for (Message message : messages) {
            messageDTOs.add(messageMapper.toDTO(message));
        }
        return messageDTOs;
    }

}
