package com.example.trainingServer.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentDTO {
    long id;
    long senderId;
    String senderName;
    String senderSurname;
    long postId;
    String content;
}
