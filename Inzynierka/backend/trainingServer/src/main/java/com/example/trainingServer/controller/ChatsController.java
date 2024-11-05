package com.example.trainingServer.controller;

import com.example.trainingServer.DTO.ChatDTO;
import com.example.trainingServer.DTO.MessageDTO;
import com.example.trainingServer.entities.Chat;
import com.example.trainingServer.entities.Message;
import com.example.trainingServer.mapper.ChatMapper;
import com.example.trainingServer.repositories.ChatRepository;
import com.example.trainingServer.repositories.MessageRepository;
import com.example.trainingServer.requests.UserAndObjectIds;
import lombok.AllArgsConstructor;
import com.example.trainingServer.mapper.MessageMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/chats")
@AllArgsConstructor
public class ChatsController {
    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;
    private final MessageMapper messageMapper;
    private final ChatMapper chatMapper;

    @GetMapping("/chatsSimplified/{userId}")
    public ResponseEntity<List<ChatDTO>> chatsSimplified(@PathVariable long userId) {
        List<Chat> chats = chatRepository.findByUser(userId);

        if (chats.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ArrayList<>());
        }

        List<ChatDTO> chatDTOs = new ArrayList<>();
        for (Chat chat : chats) {
            chatDTOs.add(chatMapper.toDTO(chat));
        }
        return ResponseEntity.ok(chatDTOs);
    }

    @PutMapping("/turnOffNotivication")
    public ResponseEntity<Void> turnOffNotivication(@RequestBody UserAndObjectIds userAndObjectIds) {
        Chat chat = chatRepository.findByChatId(userAndObjectIds.getObjectId());

        if (chat == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        boolean updated = false;
        if (chat.getUserOne().getUserId() == userAndObjectIds.getUserId()) {
            chat.setUserOneNotification(false);
            updated = true;
        }
        if (chat.getUserTwo().getUserId() == userAndObjectIds.getUserId()) {
            chat.setUserTwoNotification(false);
            updated = true;
        }

        if (updated) {
            chatRepository.save(chat);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/messagesHistory/{chatId}")
    public ResponseEntity<List<MessageDTO>> messageHistory(@PathVariable long chatId) {
        Optional<Chat> chatOptional = chatRepository.findById(chatId);
        if (chatOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ArrayList<>());
        }

        List<Message> messages = messageRepository.findByChat(chatOptional.get());
        List<MessageDTO> messageDTOs = new ArrayList<>();
        for (Message message : messages) {
            messageDTOs.add(messageMapper.toDTO(message));
        }
        return ResponseEntity.ok(messageDTOs);
    }

    @GetMapping("/messageById/{messageId}")
    public ResponseEntity<MessageDTO> getMessageById(@PathVariable long messageId) {
        Optional<Message> messageOptional = messageRepository.findById(messageId);

        if (messageOptional.isPresent()) {
            return ResponseEntity.ok(messageMapper.toDTO(messageOptional.get()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
