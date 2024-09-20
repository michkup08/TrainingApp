package com.example.trainingServer.requests;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String login;
    private String password;
    private String email;
    private String role;
    private String name;
    private String surname;
    private String description;
    private String price;
    private String availability;
}
