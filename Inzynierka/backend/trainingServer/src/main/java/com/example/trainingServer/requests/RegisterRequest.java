package com.example.trainingServer.requests;

import com.example.trainingServer.entities.Role;
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
}
