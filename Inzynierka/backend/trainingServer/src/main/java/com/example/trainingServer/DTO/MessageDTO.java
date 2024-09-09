package com.example.trainingServer.DTO;

import com.example.trainingServer.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MessageDTO {
    private String senderName;
    private String receiverName;
    private String message;
    private String date;
    private Status status;
//    private long senderId;
//    private String senderName;
//    private long receiverId;
//    private String content;
//    private String date;
//    private Status status;
}
