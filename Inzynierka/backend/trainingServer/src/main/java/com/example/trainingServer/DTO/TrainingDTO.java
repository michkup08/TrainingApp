package com.example.trainingServer.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Optional;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TrainingDTO {
    Long id;
    String name;
    int day;
    String startTime;
    String stopTime;
    int completePercent;
    List<ExerciseWithParametersDTO> exercises;
    Optional<Long> planId;
}
