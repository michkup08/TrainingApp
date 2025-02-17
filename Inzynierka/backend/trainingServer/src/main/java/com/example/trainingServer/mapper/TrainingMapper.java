package com.example.trainingServer.mapper;

import com.example.trainingServer.DTO.TrainingDTO;
import com.example.trainingServer.DTO.ExerciseWithParametersDTO;
import com.example.trainingServer.entities.Training;
import com.example.trainingServer.entities.ExerciseWithParameters;
import com.example.trainingServer.repositories.TrainingPlanRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.OptionalLong;
import java.util.stream.Collectors;

@Component
public class TrainingMapper {

    ExerciseWithParametersMapper exerciseWithParametersMapper = new ExerciseWithParametersMapper();

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
                        training.getExerciseWithParameters().stream().map(exerciseWithParametersMapper::toExerciseWithParametersDTO).collect(Collectors.toList()) : null,
                Optional.of(training.getTrainingPlan().getId())
        );
    }

    public Training toTrainingEntity(TrainingDTO trainingDTO) {
        if (trainingDTO == null) {
            return null;
        }

        Training training = new Training();
        if(trainingDTO.getId()!=null && trainingDTO.getId()>0) {
            training.setTraining_id(trainingDTO.getId());
        }
        training.setName(trainingDTO.getName());
        training.setDay(trainingDTO.getDay());
        training.setStart_time(trainingDTO.getStartTime());
        training.setStop_time(trainingDTO.getStopTime());
        training.setComplete_percent(trainingDTO.getCompletePercent());

        return training;
    }
}
