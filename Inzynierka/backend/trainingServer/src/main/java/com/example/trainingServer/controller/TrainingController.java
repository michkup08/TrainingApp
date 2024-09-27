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
import com.example.trainingServer.reqAndResp.IdAndNameReqResp;
import com.example.trainingServer.requests.CopyPlanReq;
import com.example.trainingServer.requests.SetTrainingCompleteRequest;
import com.example.trainingServer.requests.UserAndPlanIds;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
        if(!dtos.isEmpty()) {
            return dtos;
        }
        return null;
    }

    @GetMapping("/trainingPlanById/{planId}")
    public TrainingPlanDTO getTrainingPlanById(@PathVariable long planId) {
        Optional<TrainingPlan> tp = trainingPlanRepository.findById(planId);
        if(tp.isPresent()) {
            return trainingPlanMapper.toTrainingPlanDTO(tp.get());
        }
        return null;
    }

    @GetMapping("/trainingPlan/{userId}")
    public TrainingPlanDTO getTrainingPlan(@PathVariable long userId) {
        Optional<TrainingPlan> tp = trainingPlanRepository.findByUserActivatedUserIdExtended(userId);
        if (tp.isPresent()) {
            return trainingPlanMapper.toTrainingPlanDTO(tp.get());
        }
        return new TrainingPlanDTO((long)0,"",new ArrayList<>());
    }

    @GetMapping("/getActiveId/{userId}")
    public Long getActiveTrainingPlan(@PathVariable long userId) {

        Optional<TrainingPlan> tp = trainingPlanRepository.findByUserActivatedUserIdExtended(userId);
        if (tp.isPresent()) {
            return tp.get().getId();
        }
        return null;
    }

    @PutMapping("/setActiveId")
    public void setActiveTrainingPlan(@RequestBody UserAndPlanIds userAndPlanIds) {

        Optional<TrainingPlan> tpOpt = trainingPlanRepository.findByUserActivatedUserIdExtended(userAndPlanIds.getUserId());
        if (tpOpt.isPresent()) {
            TrainingPlan tp = tpOpt.get();
            tp.setUserActivated(null);
            trainingPlanRepository.saveAndFlush(tp);
        }
        TrainingPlan newtp = trainingPlanRepository.findById(userAndPlanIds.getPlanId()).get();
        newtp.setUserActivated(userRepository.findById(userAndPlanIds.getUserId()).get());
        trainingPlanRepository.saveAndFlush(newtp);

    }

    @PutMapping("/traningComplete")
    public void traningComplete(@RequestBody SetTrainingCompleteRequest setTrainingCompleteRequest) {
        trainingRepository.setCompletePercent(setTrainingCompleteRequest.getCompletePercent(), setTrainingCompleteRequest.getTrainingId());
    }

    @PostMapping("/addEmptyTrainingPlan")
    public Long addEmptyTrainingPlan(@RequestBody IdAndNameReqResp idAndNameRequest) {
        TrainingPlan tp = new TrainingPlan();
        tp.setUser(userRepository.findById(idAndNameRequest.getId()).get());
        tp.setName(idAndNameRequest.getName());
        trainingPlanRepository.saveAndFlush(tp);
        return tp.getId();
    }

    @PostMapping("/copyTrainingPlan")
    public boolean copyTrainingPlan(@RequestBody CopyPlanReq copyPlanReq) {
        try {
            TrainingPlan oryginalTp = trainingPlanRepository.findById(copyPlanReq.getPlanId()).get();
            TrainingPlan copyTp = new TrainingPlan();
            copyTp.setUser(userRepository.findByUserId(copyPlanReq.getUserId()));
            copyTp.setName(oryginalTp.getName()+" - copy");
            trainingPlanRepository.saveAndFlush(copyTp);
            for(Training training: oryginalTp.getTrainings()) {
                Training copyTraining = new Training();
                copyTraining.setTrainingPlan(copyTp);
                copyTraining.setName(training.getName());
                copyTraining.setComplete_percent(0);
                copyTraining.setDay(training.getDay());
                copyTraining.setStart_time(training.getStart_time());
                copyTraining.setStop_time(training.getStop_time());
                trainingRepository.saveAndFlush(copyTraining);
                List<ExerciseWithParameters> trainingsExercises = new ArrayList<>();
                for (ExerciseWithParameters exerciseWithParameters: training.getExerciseWithParameters())
                {
                    ExerciseWithParameters copyExerciseWithParameters = new ExerciseWithParameters();
                    copyExerciseWithParameters.setTraining(copyTraining);
                    copyExerciseWithParameters.setExercise(exerciseWithParameters.getExercise());
                    copyExerciseWithParameters.setParameters(exerciseWithParameters.getParameters());
                    exerciseWithParametersRepository.saveAndFlush(copyExerciseWithParameters);
                    trainingsExercises.add(copyExerciseWithParameters);
                }
                copyTraining.setExerciseWithParameters(trainingsExercises);
                trainingRepository.saveAndFlush(copyTraining);
            }
            return true;
        }
        catch ( Exception e ) {
            e.printStackTrace();
        }
        return false;
    }

    @PutMapping("/changeTrainingPlanName")
    public void changeTrainingPlanName(@RequestBody IdAndNameReqResp idAndNameRequest) {
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
