package com.example.trainingServer.mapper;

import com.example.trainingServer.DTO.ExerciseDTO;
import com.example.trainingServer.entities.Exercise;
import org.springframework.stereotype.Component;

@Component
public class ExerciseMapper {

    // Converts Exercise entity to ExerciseDTO
    public static ExerciseDTO toExerciseDTO(Exercise exercise) {
        if (exercise == null) {
            return null;
        }

        return new ExerciseDTO(
                Math.toIntExact(exercise.getExercise_id()),
                exercise.getName(),
                exercise.getDescription()
        );
    }

    // Converts ExerciseDTO to Exercise entity
    public static Exercise toExerciseEntity(ExerciseDTO exerciseDTO) {
        if (exerciseDTO == null) {
            return null;
        }

        Exercise exercise = new Exercise();
        exercise.setExercise_id(exerciseDTO.getId());
        exercise.setName(exerciseDTO.getName());
        exercise.setDescription(exerciseDTO.getDescription());
        // Additional relationships like Training set should be set outside of this method
        return exercise;
    }
}
