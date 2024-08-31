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
import com.example.trainingServer.repositories.*;
import com.example.trainingServer.requests.IdAndNameRequest;
import com.example.trainingServer.requests.SetTrainingCompleteRequest;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/training")
public class TrainingController {

    private final ExerciseWithParametersRepository exerciseWithParametersRepository;
    private final ExerciseRepository exerciseRepository;
    private final TrainingPlanRepository trainingPlanRepository;
    private final TrainingRepository trainingRepository;
    private final UserRepository userRepository;

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

    @GetMapping("/trainingPlanById/{planId}")
    public TrainingPlanDTO getTrainingPlanById(@PathVariable long planId) {

        TrainingPlan tp = trainingPlanRepository.findById(planId).get();
        return trainingPlanMapper.toTrainingPlanDTO(tp);
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
    public Long addEmptyTrainingPlan(@RequestBody IdAndNameRequest idAndNameRequest) {
        TrainingPlan tp = new TrainingPlan();
        tp.setUser(userRepository.findById(idAndNameRequest.getId()).get());
        tp.setName(idAndNameRequest.getName());
        trainingPlanRepository.saveAndFlush(tp);
        return tp.getId();
    }

    @PutMapping("/changeTrainingPlanName")
    public void changeTrainingPlanName(@RequestBody IdAndNameRequest idAndNameRequest) {
        TrainingPlan tp = trainingPlanRepository.findById(idAndNameRequest.getId()).get();
        tp.setName(idAndNameRequest.getName());
        trainingPlanRepository.saveAndFlush(tp);
    }


    @PostMapping("/addTraining")
    public Long addTraining(@RequestBody TrainingDTO trainingDTO) {
        Training training = trainingMapper.toTrainingEntity(trainingDTO);
        training.setComplete_percent(0);
        TrainingPlan tp = trainingPlanRepository.findById(trainingDTO.getPlanId().get()).get();
        training.setTrainingPlan(tp);
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

    @PutMapping("/updateTraining")
    public void updateTraining(@RequestBody TrainingDTO trainingDTO) {
        Training training = trainingRepository.findById(trainingDTO.getId()).get();
        training.setComplete_percent(0);
        training.setDay(trainingDTO.getDay());
        training.setStart_time(trainingDTO.getStartTime());
        training.setStop_time(trainingDTO.getStopTime());
        training.setName(trainingDTO.getName());
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
    }


}
