package com.example.trainingServer.entities;

import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
//@Table(name = "messages")
public class Message {

//    @Id
//    @Column(name = "id", nullable = false)
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private long id;


    private String senderId;
    private String senderName;
    private String receiverName;
    private String receiverId;
    private String message;
    private String date;
    private Status status;
}
