package com.example.trainingServer.controller;

import com.example.trainingServer.DTO.ExerciseDTO;
import com.example.trainingServer.DTO.TrainingPlanDTO;
import com.example.trainingServer.entities.Exercise;
import com.example.trainingServer.entities.TrainingPlan;
import com.example.trainingServer.mapper.ExerciseMapper;
import com.example.trainingServer.mapper.TrainingPlanMapper;
import com.example.trainingServer.repositories.ExerciseRepository;
import com.example.trainingServer.repositories.TrainingPlanRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/training")
public class TrainingController {
    private final ExerciseMapper exerciseMapper;
    ExerciseRepository exerciseRepository;
    TrainingPlanRepository trainingPlanRepository;

    private final TrainingPlanMapper trainingPlanMapper;

    TrainingController(ExerciseRepository exerciseRepository, TrainingPlanRepository trainingPlanRepository, TrainingPlanMapper trainingPlanMapper, ExerciseMapper exerciseMapper) {
        this.exerciseRepository = exerciseRepository;
        this.trainingPlanRepository = trainingPlanRepository;
        this.trainingPlanMapper = trainingPlanMapper;
        this.exerciseMapper = exerciseMapper;
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

    @GetMapping("/trainingPlans/{userId}")
    public List<TrainingPlanDTO> getTrainingPlans(@PathVariable long userId) {

        List<TrainingPlan> tpl = trainingPlanRepository.findByUserUserIdExtended(userId);
        List<TrainingPlanDTO> dtos = new ArrayList<>();
        for (TrainingPlan tp : tpl) {
            dtos.add(trainingPlanMapper.toTrainingPlanDTO(tp));
        }
        return dtos;
    }

    @GetMapping("/trainingPlan/{userId}")
    public TrainingPlanDTO getTrainingPlan(@PathVariable long userId) {

        TrainingPlan tp = trainingPlanRepository.findByUserActivatedUserIdExtended(userId);
        return trainingPlanMapper.toTrainingPlanDTO(tp);
    }
}
