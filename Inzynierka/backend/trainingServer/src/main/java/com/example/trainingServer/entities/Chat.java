package com.example.trainingServer.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "chats")
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_id", nullable = false)
    private long chatId;

    @ManyToOne
    @JoinColumn(name = "user_one_id", referencedColumnName = "user_id")
    private User userOne;

    @ManyToOne
    @JoinColumn(name = "user_two_id", referencedColumnName = "user_id")
    private User userTwo;

    @OneToMany(mappedBy = "chat")
    @JsonIgnore
    private List<Message> messages;

    @Column(name = "last_message_date")
    private String lastMessageDate;

    public Chat(User userOne, User userTwo, String lastMessageDate) {
        this.userOne = userOne;
        this.userTwo = userTwo;
        this.lastMessageDate = lastMessageDate;
        messages = new ArrayList<>();
    }
}
