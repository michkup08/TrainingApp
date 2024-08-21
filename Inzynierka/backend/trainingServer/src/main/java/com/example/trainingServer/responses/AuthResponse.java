package com.example.trainingServer.responses;

import com.example.trainingServer.entities.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {

    private long user_id;
    private String login;
    private String email;
    private Role role;
    private String name;
    private String surname;
    private String authToken;

}
