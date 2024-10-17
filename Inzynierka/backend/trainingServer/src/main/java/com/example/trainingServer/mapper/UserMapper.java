package com.example.trainingServer.mapper;

import com.example.trainingServer.entities.User;
import com.example.trainingServer.DTO.UserDTO;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDTO toUserDTO(User user) {
        if (user == null) {
            return null;
        }

        UserDTO userDTO = new UserDTO();
        userDTO.setUser_id(user.getUserId());
        userDTO.setEmail(user.getEmail());
        userDTO.setRole(user.getRole());
        userDTO.setName(user.getName());
        userDTO.setSurname(user.getSurname());

        return userDTO;
    }

    public User toUser(UserDTO userDTO) {
        if (userDTO == null) {
            return null;
        }

        User user = new User();
        user.setUserId(userDTO.getUser_id());
        user.setLogin(userDTO.getLogin());
        user.setPassword(userDTO.getPassword());
        user.setEmail(userDTO.getEmail());
        user.setRole(userDTO.getRole());
        user.setName(userDTO.getName());
        user.setSurname(userDTO.getSurname());

        return user;
    }
}

