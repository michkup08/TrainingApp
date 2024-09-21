package com.example.trainingServer.controller;

import com.example.trainingServer.DTO.TrainerProfileDTO;
import com.example.trainingServer.entities.TrainerProfile;
import com.example.trainingServer.mapper.TrainerProfileMapper;
import com.example.trainingServer.repositories.TrainerProfileRepository;
import com.example.trainingServer.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/trainer")
@AllArgsConstructor
public class TrainerController {

    UserRepository userRepository;
    TrainerProfileRepository trainerProfileRepository;

    TrainerProfileMapper trainerProfileMapper;

    @GetMapping("/profile/{userId}")
    public TrainerProfileDTO getProfile(@PathVariable long userId)
    {
        TrainerProfile trainerProfile = trainerProfileRepository.findByUser(userRepository.findByUserId(userId));
        return trainerProfileMapper.toDTO(trainerProfile);
    }
}
