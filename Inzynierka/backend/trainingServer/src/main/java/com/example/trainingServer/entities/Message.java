package com.example.trainingServer.entities;

import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "messages")
public class Message {

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "sender_id")
    private long senderId;

    @Column(name="senderName")
    private String senderName;

    @Column(name="reciver_id")
    private long receiverId;

    @Column(name = "reciverName")
    private String receiverName;

    @Column(name = "content")
    private String content;

    @Column(name = "date")
    private String date;

//    @Column(name = "status")
//    @Enumerated(EnumType.STRING)
//    private Status status;

    @ManyToOne
    @JoinColumn(name = "chat_id", referencedColumnName = "chat_id")
    private Chat chat;

    Message (Chat chat, long senderId, String senderName, long receiverId, String receiverName, String content, String date) {
        this.chat = chat;
        this.senderId = senderId;
        this.senderName = senderName;
        this.receiverId = receiverId;
        this.receiverName = receiverName;
        this.content = content;
        this.date = date;
    }
}
