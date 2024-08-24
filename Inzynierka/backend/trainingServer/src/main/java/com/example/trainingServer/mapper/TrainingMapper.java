package com.example.trainingServer.mapper;

import com.example.trainingServer.DTO.TrainingDTO;
import com.example.trainingServer.DTO.ExerciseWithParametersDTO;
import com.example.trainingServer.entities.Training;
import com.example.trainingServer.entities.ExerciseWithParameters;
import java.util.stream.Collectors;

public class TrainingMapper {

    // Converts Training entity to TrainingDTO
    public static TrainingDTO toTrainingDTO(Training training) {
        if (training == null) {
            return null;
        }

        return new TrainingDTO(
                training.getTraining_id(),
                training.getName(),
                training.getDay(),
                training.getStart_time(),
                training.getStop_time(),
                training.getComplete_percent(),
                training.getExerciseWithParameters() != null ?
                        training.getExerciseWithParameters().stream().map(ExerciseWithParametersMapper::toExerciseWithParametersDTO).collect(Collectors.toList()) : null
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
        training.setComplete_percent(trainingDTO.getCompletePercent());
        // Relationships like TrainingPlan and ExerciseWithParameters should be set outside this method
        return training;
    }
}
