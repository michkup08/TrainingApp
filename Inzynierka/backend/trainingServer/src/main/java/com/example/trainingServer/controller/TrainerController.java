package com.example.trainingServer.controller;

import com.example.trainingServer.DTO.TrainerProfileDTO;
import com.example.trainingServer.entities.TrainerProfile;
import com.example.trainingServer.entities.User;
import com.example.trainingServer.mapper.TrainerProfileMapper;
import com.example.trainingServer.repositories.TrainerProfileRepository;
import com.example.trainingServer.repositories.UserRepository;
import com.example.trainingServer.service.TrainerService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/trainer")
@AllArgsConstructor
public class TrainerController {

    UserRepository userRepository;
    TrainerProfileRepository trainerProfileRepository;

    TrainerProfileMapper trainerProfileMapper;

    TrainerService trainerService;

    @GetMapping("/profile/{userId}")
    public TrainerProfileDTO getProfile(@PathVariable long userId)
    {
        TrainerProfile trainerProfile = trainerProfileRepository.findByUser(userRepository.findByUserId(userId));
        return trainerProfileMapper.toDTO(trainerProfile);
    }

    @GetMapping("/trainers/{page}")
    public List<TrainerProfileDTO> getNewPosts(@PathVariable int page)
    {
        try {
            Pageable pageable = PageRequest.of(page, 5);
            Page<TrainerProfile> trainerProfiles = trainerProfileRepository.findAll(pageable);
            List<TrainerProfileDTO> trainersDTOs = new ArrayList<>();
            for (TrainerProfile trainerProfile : trainerProfiles)
            {
                TrainerProfileDTO trainerDTO = trainerProfileMapper.toDTO(trainerProfile);
                String image = trainerService.getBase64ImageForPost(trainerProfile.getUser().getUserId());
                if (image != null)
                {
                    trainerDTO.setProfileImage(image);
                }
                User trainer = userRepository.findByUserId(trainerProfile.getUser().getUserId());
                trainerDTO.setFullName(trainer.getName()+" "+trainer.getSurname());
                trainerDTO.setEmail(trainer.getEmail());
                trainersDTOs.add(trainerDTO);
            }
            return trainersDTOs;
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return new ArrayList<>();
    }
}
