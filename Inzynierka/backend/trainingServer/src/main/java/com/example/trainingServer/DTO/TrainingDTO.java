package com.example.trainingServer.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TrainingDTO {
    int id;
    String name;
    int day;
    String startTime;
    String stopTime;
    List<ExerciseDTO> exercises;
}
