package com.example.trainingServer.mapper;

import com.example.trainingServer.entities.Message;
import com.example.trainingServer.DTO.MessageDTO;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class MessageMapper {

    public Message toEntity(MessageDTO messageDTO) {
        if (messageDTO == null) {
            return null;
        }
        Message message = new Message();
        message.setSenderId(messageDTO.getSenderId());
        message.setSenderName(messageDTO.getSenderName());
        message.setReceiverId(messageDTO.getReceiverId());
        message.setReceiverName(messageDTO.getReceiverName());
        message.setContent(messageDTO.getMessage());
        message.setDate(messageDTO.getDate());
        message.setTrainingId(messageDTO.getTrainingId());
        return message;
    }

    public MessageDTO toDTO(Message message) {
        if (message == null) {
            return null;
        }
        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setId(message.getId());
        messageDTO.setSenderId(message.getSenderId());
        messageDTO.setSenderName(message.getSenderName());
        messageDTO.setReceiverId(message.getReceiverId());
        messageDTO.setReceiverName(message.getReceiverName());
        messageDTO.setMessage(message.getContent());
        messageDTO.setDate(message.getDate());
        messageDTO.setTrainingId(message.getTrainingId());

        return messageDTO;
    }
}

