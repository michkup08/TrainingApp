package com.example.trainingServer.controller;

import com.example.trainingServer.DTO.ExerciseDTO;
import com.example.trainingServer.DTO.ExerciseWithParametersDTO;
import com.example.trainingServer.DTO.TrainingDTO;
import com.example.trainingServer.DTO.TrainingPlanDTO;
import com.example.trainingServer.entities.Exercise;
import com.example.trainingServer.entities.ExerciseWithParameters;
import com.example.trainingServer.entities.Training;
import com.example.trainingServer.entities.TrainingPlan;
import com.example.trainingServer.mapper.ExerciseMapper;
import com.example.trainingServer.mapper.ExerciseWithParametersMapper;
import com.example.trainingServer.mapper.TrainingMapper;
import com.example.trainingServer.mapper.TrainingPlanMapper;
import com.example.trainingServer.repositories.ExerciseRepository;
import com.example.trainingServer.repositories.ExerciseWithParametersRepository;
import com.example.trainingServer.repositories.TrainingPlanRepository;
import com.example.trainingServer.repositories.TrainingRepository;
import com.example.trainingServer.requests.SetTrainingCompleteRequest;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@AllArgsConstructor
@RestController
@RequestMapping("/training")
public class TrainingController {

    private final ExerciseWithParametersRepository exerciseWithParametersRepository;
    ExerciseRepository exerciseRepository;
    TrainingPlanRepository trainingPlanRepository;
    TrainingRepository trainingRepository;

    private final TrainingPlanMapper trainingPlanMapper;
    private final ExerciseMapper exerciseMapper;
    private final TrainingMapper trainingMapper;
    private final ExerciseWithParametersMapper exerciseWithParametersMapper;


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

    @PostMapping("/addEmptyTrainingPlan")
    Long addEmptyTrainingPlan() {
        TrainingPlan tp = new TrainingPlan();
        trainingPlanRepository.save(tp);
        return tp.getId();
    }

    @PostMapping("/addTraining")
    Long addTraining(@RequestBody TrainingDTO trainingDTO) {
        Training training = trainingMapper.toTrainingEntity(trainingDTO);
        training.setComplete_percent(0);
        trainingRepository.saveAndFlush(training);
        List<ExerciseWithParameters> ewpl = new ArrayList<>();
        for (ExerciseWithParametersDTO ex : trainingDTO.getExercises()) {
            ExerciseWithParameters e = exerciseWithParametersMapper.toExerciseWithParametersEntity(ex);
            e.setExercise(exerciseMapper.toExerciseEntity(ex.getExercise()));
            e.setTraining(training);
            exerciseWithParametersRepository.saveAndFlush(e);
            ewpl.add(e);
        }
        training.setExerciseWithParameters(ewpl);
        trainingRepository.saveAndFlush(training);
        return training.getTraining_id();
    }

}
