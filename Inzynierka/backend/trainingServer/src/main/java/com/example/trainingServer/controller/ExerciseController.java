package com.example.trainingServer.controller;

import com.example.trainingServer.DTO.ExerciseDTO;
import com.example.trainingServer.DTO.ExerciseWithParametersDTO;
import com.example.trainingServer.entities.Exercise;
import com.example.trainingServer.entities.ExerciseWithParameters;
import com.example.trainingServer.entities.User;
import com.example.trainingServer.mapper.ExerciseMapper;
import com.example.trainingServer.mapper.ExerciseWithParametersMapper;
import com.example.trainingServer.repositories.ExerciseRepository;
import com.example.trainingServer.repositories.ExerciseWithParametersRepository;

import com.example.trainingServer.reqAndResp.IdAndNameReqResp;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/exercise")
@AllArgsConstructor
public class ExerciseController {
    private final ExerciseRepository exerciseRepository;
    private final ExerciseWithParametersRepository exerciseWithParametersRepository;

    private final ExerciseWithParametersMapper exerciseWithParametersMapper;
    private final ExerciseMapper exerciseMapper;

    @PostMapping("/addExerciseWithParameters")
    Long addExerciseWithParameters(@RequestBody ExerciseWithParametersDTO exerciseWithParametersDTO) {
        ExerciseWithParameters exerciseWithParameters = exerciseWithParametersMapper.toExerciseWithParametersEntity(exerciseWithParametersDTO);
        exerciseWithParameters.setExercise(exerciseMapper.toExerciseEntity(exerciseWithParametersDTO.getExercise()));
        exerciseWithParametersRepository.saveAndFlush(exerciseWithParameters);
        return exerciseWithParameters.getExercises_with_parameters_id();
    }

    @DeleteMapping("/exerciseWithParameters/{ewpId}")
    void deleteExerciseWithParameters(@PathVariable Long ewpId) {
        exerciseWithParametersRepository.deleteById(ewpId);
        exerciseWithParametersRepository.flush();
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

    @GetMapping("/exercisesByReg/{fragment}")
    List<ExerciseDTO> getUsersByNameFragment(@PathVariable String fragment)
    {
        try
        {
            String reg = "[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]*"+fragment+"[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]*";
            Pattern pattern = Pattern.compile(reg);
            List<Exercise> all = exerciseRepository.findAll();
            List<ExerciseDTO> fits = new ArrayList<>();
            for(Exercise exercise: all)
            {
                if(fits.size()>=20)
                {
                    break;
                }
                Matcher matcher = pattern.matcher(exercise.getName());
                if(matcher.matches())
                {
                    fits.add(exerciseMapper.toExerciseDTO(exercise));
                }
            }
            return fits;
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        return new ArrayList<>();
    }
}
