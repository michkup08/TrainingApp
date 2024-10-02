package com.example.trainingServer.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostDTO {
    private long id;
    private long senderId;
    private String senderFullName;
    private String context;
    private String image;
    private long likes;
    private boolean liked;
}
