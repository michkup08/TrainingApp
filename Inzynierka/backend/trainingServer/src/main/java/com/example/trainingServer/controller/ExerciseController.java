package com.example.trainingServer.controller;

import com.example.trainingServer.DTO.ExerciseDTO;
import com.example.trainingServer.DTO.ExerciseWithParametersDTO;
import com.example.trainingServer.entities.Exercise;
import com.example.trainingServer.entities.ExerciseWithParameters;
import com.example.trainingServer.mapper.ExerciseMapper;
import com.example.trainingServer.mapper.ExerciseWithParametersMapper;
import com.example.trainingServer.repositories.ExerciseRepository;
import com.example.trainingServer.repositories.ExerciseWithParametersRepository;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/exercise")
@AllArgsConstructor
public class ExerciseController {
    private final ExerciseRepository exerciseRepository;
    private final ExerciseWithParametersRepository exerciseWithParametersRepository;

    private final ExerciseWithParametersMapper exerciseWithParametersMapper;
    private final ExerciseMapper exerciseMapper;

    @PostMapping("/addExerciseWithParameters")
    void addExerciseWithParameters(@RequestBody ExerciseWithParametersDTO exerciseWithParametersDTO) {
        ExerciseWithParameters exerciseWithParameters = exerciseWithParametersMapper.toExerciseWithParametersEntity(exerciseWithParametersDTO);
        exerciseWithParameters.setExercise(exerciseMapper.toExerciseEntity(exerciseWithParametersDTO.getExercise()));
        exerciseWithParametersRepository.saveAndFlush(exerciseWithParameters);
    }

    @PostMapping("/addExercise")
    void addExercise(@RequestBody ExerciseDTO exerciseDTO) {
        Exercise exercise = exerciseMapper.toExerciseEntity(exerciseDTO);
        exerciseRepository.saveAndFlush(exercise);
    }

    @PutMapping("/updateExerciseWithParameters")
    void updateExerciseWithParameters(@RequestBody ExerciseWithParametersDTO exerciseWithParametersDTO) {
        ExerciseWithParameters existingExercise = exerciseWithParametersRepository.findById(exerciseWithParametersDTO.getId())
                .orElseThrow(() -> new RuntimeException("ExerciseWithParameters not found with id " + exerciseWithParametersDTO.getId()));
        existingExercise.setExercise(exerciseMapper.toExerciseEntity(exerciseWithParametersDTO.getExercise()));
        existingExercise.setParameters(exerciseWithParametersDTO.getParameters());
        exerciseWithParametersRepository.saveAndFlush(existingExercise);
    }

    @GetMapping("/allExercises")
    public List<ExerciseDTO> getAllExercises() {

        List<Exercise> el = exerciseRepository.findAll();
        List<ExerciseDTO> dtos = new ArrayList<>();
        for (Exercise e : el) {
            dtos.add(exerciseMapper.toExerciseDTO(e));
        }
        return dtos;
    }
}
