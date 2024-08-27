package com.example.trainingServer.mapper;

import com.example.trainingServer.DTO.TrainingPlanDTO;
import com.example.trainingServer.entities.TrainingPlan;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class TrainingPlanMapper {

    TrainingMapper trainingMapper = new TrainingMapper();

    public TrainingPlanDTO toTrainingPlanDTO(TrainingPlan trainingPlan) {
        if (trainingPlan == null) {
            return null;
        }

        return new TrainingPlanDTO(
                trainingPlan.getId(),
                trainingPlan.getName(),
                trainingPlan.getTrainings() != null ?
                        trainingPlan.getTrainings().stream().map(trainingMapper::toTrainingDTO).collect(Collectors.toList()) : null
        );
    }

    public TrainingPlan toTrainingPlanEntity(TrainingPlanDTO trainingPlanDTO) {
        if (trainingPlanDTO == null) {
            return null;
        }

        TrainingPlan trainingPlan = new TrainingPlan();
        trainingPlan.setId(trainingPlanDTO.getId());
        trainingPlan.setName(trainingPlanDTO.getName());
        // Additional fields like user and userActivated should be set outside of this method
        return trainingPlan;
    }
}
