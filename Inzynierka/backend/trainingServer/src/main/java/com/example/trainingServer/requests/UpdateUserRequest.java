package com.example.trainingServer.requests;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserRequest {
    private long userId;
    private String login;
    private String password;
    private String email;
    private String oldPassword;
    private String role;
    private long trainerProfileId;
    private String description;
    private String price;
    private String availability;
}
