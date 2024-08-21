package com.example.trainingServer.mapper;

import com.example.trainingServer.DTO.TrainingDTO;
import com.example.trainingServer.entities.Training;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class TrainingMapper {

    // Converts Training entity to TrainingDTO
    public static TrainingDTO toTrainingDTO(Training training) {
        if (training == null) {
            return null;
        }

        return new TrainingDTO(
                Math.toIntExact(training.getTraining_id()),
                training.getName(),
                training.getDay(),
                training.getStart_time(),
                training.getStop_time(),
                training.getExercises() != null ?
                        training.getExercises().stream().map(ExerciseMapper::toExerciseDTO).collect(Collectors.toList()) : null
        );
    }

    // Converts TrainingDTO to Training entity
    public static Training toTrainingEntity(TrainingDTO trainingDTO) {
        if (trainingDTO == null) {
            return null;
        }

        Training training = new Training();
        training.setTraining_id(trainingDTO.getId());
        training.setName(trainingDTO.getName());
        training.setDay(trainingDTO.getDay());
        training.setStart_time(trainingDTO.getStartTime());
        training.setStop_time(trainingDTO.getStopTime());
        // Additional relationships like TrainingPlan should be set outside of this method
        return training;
    }
}
