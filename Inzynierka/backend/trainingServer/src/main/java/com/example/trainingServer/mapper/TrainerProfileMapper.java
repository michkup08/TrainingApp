package com.example.trainingServer.mapper;

import com.example.trainingServer.DTO.TrainerProfileDTO;
import com.example.trainingServer.entities.TrainerProfile;
import org.springframework.stereotype.Component;

@Component
public class TrainerProfileMapper {

    public TrainerProfileDTO toDTO(TrainerProfile trainerProfile) {
        if (trainerProfile == null) {
            return null;
        }
        return new TrainerProfileDTO(
                trainerProfile.getTrainer_profile_id(),
                trainerProfile.getDescriptions(),
                trainerProfile.getOffer(),
                trainerProfile.getAvailability()
        );
    }

    public TrainerProfile toEntity(TrainerProfileDTO trainerProfileDTO) {
        if (trainerProfileDTO == null) {
            return null;
        }
        TrainerProfile trainerProfile = new TrainerProfile();
        trainerProfile.setTrainer_profile_id(trainerProfileDTO.getId());
        trainerProfile.setDescriptions(trainerProfileDTO.getDescription());
        trainerProfile.setOffer(trainerProfileDTO.getPrice());
        trainerProfile.setAvailability(trainerProfileDTO.getAvailability());
        return trainerProfile;
    }
}

