package com.example.trainingServer.controller;

import com.example.trainingServer.DTO.TrainingPlanDTO;
import com.example.trainingServer.entities.Exercise;
import com.example.trainingServer.entities.TrainingPlan;
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
    ExerciseRepository exerciseRepository;
    TrainingPlanRepository trainingPlanRepository;

    private final TrainingPlanMapper trainingPlanMapper;

    TrainingController(ExerciseRepository exerciseRepository, TrainingPlanRepository trainingPlanRepository, TrainingPlanMapper trainingPlanMapper) {
        this.exerciseRepository = exerciseRepository;
        this.trainingPlanRepository = trainingPlanRepository;
        this.trainingPlanMapper = trainingPlanMapper;
    }

    @GetMapping("/allExercises")
    public List<Exercise> getAllExercises() {
        return exerciseRepository.findAll();
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
}
