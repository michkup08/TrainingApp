package com.example.trainingServer.controller;

import com.example.trainingServer.DTO.ExerciseDTO;
import com.example.trainingServer.DTO.TrainingPlanDTO;
import com.example.trainingServer.entities.Exercise;
import com.example.trainingServer.entities.TrainingPlan;
import com.example.trainingServer.mapper.ExerciseMapper;
import com.example.trainingServer.mapper.TrainingPlanMapper;
import com.example.trainingServer.repositories.ExerciseRepository;
import com.example.trainingServer.repositories.TrainingPlanRepository;
import com.example.trainingServer.repositories.TrainingRepository;
import com.example.trainingServer.requests.SetTrainingCompleteRequest;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/training")
public class TrainingController {

    ExerciseRepository exerciseRepository;
    TrainingPlanRepository trainingPlanRepository;
    TrainingRepository trainingRepository;

    private final TrainingPlanMapper trainingPlanMapper;
    private final ExerciseMapper exerciseMapper;

    TrainingController(ExerciseRepository exerciseRepository, TrainingPlanRepository trainingPlanRepository, TrainingPlanMapper trainingPlanMapper, ExerciseMapper exerciseMapper, TrainingRepository trainingRepository) {
        this.exerciseRepository = exerciseRepository;
        this.trainingPlanRepository = trainingPlanRepository;
        this.trainingPlanMapper = trainingPlanMapper;
        this.exerciseMapper = exerciseMapper;
        this.trainingRepository = trainingRepository;
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

    @PutMapping("/traningComplete")
    public void traningComplete(@RequestBody SetTrainingCompleteRequest setTrainingCompleteRequest) {
        trainingRepository.setCompletePercent(setTrainingCompleteRequest.getCompletePercent(), setTrainingCompleteRequest.getTrainingId());
    }
}
