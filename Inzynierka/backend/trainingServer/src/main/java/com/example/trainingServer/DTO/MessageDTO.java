package com.example.trainingServer.DTO;

import com.example.trainingServer.entities.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Optional;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MessageDTO {
    private long id;
    private long senderId;
    private String senderName;
    private long receiverId;
    private String receiverName;
    private String message;
    private String date;
    private Long trainingId;
}
