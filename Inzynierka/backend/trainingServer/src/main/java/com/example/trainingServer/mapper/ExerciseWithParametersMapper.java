package com.example.trainingServer.mapper;

import com.example.trainingServer.DTO.ExerciseWithParametersDTO;
import com.example.trainingServer.DTO.ExerciseDTO;
import com.example.trainingServer.entities.ExerciseWithParameters;
import org.springframework.stereotype.Component;

@Component
public class ExerciseWithParametersMapper {

    public ExerciseWithParametersDTO toExerciseWithParametersDTO(ExerciseWithParameters exerciseWithParameters) {
        if (exerciseWithParameters == null) {
            return null;
        }

        ExerciseDTO exerciseDTO = exerciseWithParameters.getExercise() != null ?
                ExerciseMapper.toExerciseDTO(exerciseWithParameters.getExercise()) : null;

        return new ExerciseWithParametersDTO(
                exerciseWithParameters.getExercises_with_parameters_id(),
                exerciseDTO,
                exerciseWithParameters.getParameters()
        );
    }

    public ExerciseWithParameters toExerciseWithParametersEntity(ExerciseWithParametersDTO exerciseWithParametersDTO) {
        if (exerciseWithParametersDTO == null) {
            return null;
        }
        ExerciseWithParameters exerciseWithParameters = new ExerciseWithParameters();
        exerciseWithParameters.setParameters(exerciseWithParametersDTO.getParameters());
        return exerciseWithParameters;
    }
}
