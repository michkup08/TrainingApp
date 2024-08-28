package com.example.trainingServer.mapper;

import com.example.trainingServer.DTO.TrainingDTO;
import com.example.trainingServer.DTO.ExerciseWithParametersDTO;
import com.example.trainingServer.entities.Training;
import com.example.trainingServer.entities.ExerciseWithParameters;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class TrainingMapper {

    ExerciseWithParametersMapper exerciseWithParametersMapper = new ExerciseWithParametersMapper();
    // Converts Training entity to TrainingDTO
    public TrainingDTO toTrainingDTO(Training training) {
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
                        training.getExerciseWithParameters().stream().map(exerciseWithParametersMapper::toExerciseWithParametersDTO).collect(Collectors.toList()) : null
        );
    }

    // Converts TrainingDTO to Training entity
    public Training toTrainingEntity(TrainingDTO trainingDTO) {
        if (trainingDTO == null) {
            return null;
        }

        Training training = new Training();
        if(trainingDTO.getId()!=null) {
            training.setTraining_id(trainingDTO.getId());
        }
        training.setName(trainingDTO.getName());
        training.setDay(trainingDTO.getDay());
        training.setStart_time(trainingDTO.getStartTime());
        training.setStop_time(trainingDTO.getStopTime());
        training.setComplete_percent(trainingDTO.getCompletePercent());
        // Relationships like TrainingPlan and ExerciseWithParameters should be set outside this method
        return training;
    }
}
