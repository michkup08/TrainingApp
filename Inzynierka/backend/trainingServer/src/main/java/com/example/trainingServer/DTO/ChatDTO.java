package com.example.trainingServer.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChatDTO {
    long id;
    long user1Id;
    long user2Id;
    String user1Name;
    String user2Name;
    Boolean user1Notification;
    Boolean user2Notification;
    String lastMessageDate;
}
