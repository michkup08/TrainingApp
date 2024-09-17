package com.example.trainingServer.DTO;

import com.example.trainingServer.entities.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private long user_id;
    private String login;
    private String email;
    private Role role;
    private String name;
    private String surname;
}
