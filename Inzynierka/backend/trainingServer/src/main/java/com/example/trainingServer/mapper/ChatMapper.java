package com.example.trainingServer.mapper;


import com.example.trainingServer.entities.Chat;
import com.example.trainingServer.DTO.ChatDTO;
import com.example.trainingServer.entities.User;
import org.springframework.stereotype.Component;

@Component
public class ChatMapper {

    public Chat toEntity(ChatDTO chatDTO, User userOne, User userTwo) {
        if (chatDTO == null) {
            return null;
        }
        Chat chat = new Chat();
        chat.setChatId(chatDTO.getId());
        chat.setUserOne(userOne);
        chat.setUserTwo(userTwo);
        chat.setUserOneNotification(chatDTO.getUser1Notification());
        chat.setUserTwoNotification(chatDTO.getUser2Notification());
        chat.setLastMessageDate(chatDTO.getLastMessageDate());
        return chat;
    }

    public ChatDTO toDTO(Chat chat) {
        if (chat == null) {
            return null;
        }
        ChatDTO chatDTO = new ChatDTO();
        chatDTO.setId(chat.getChatId());
        chatDTO.setUser1Id(chat.getUserOne().getUserId());
        chatDTO.setUser2Id(chat.getUserTwo().getUserId());
        chatDTO.setUser1Name(chat.getUserOne().getName() + " " + chat.getUserOne().getSurname());
        chatDTO.setUser2Name(chat.getUserTwo().getName() + " " + chat.getUserTwo().getSurname());
        chatDTO.setUser1Notification(chat.isUserOneNotification());
        chatDTO.setUser2Notification(chat.isUserTwoNotification());
        chatDTO.setLastMessageDate(chat.getLastMessageDate());
        return chatDTO;
    }
}
