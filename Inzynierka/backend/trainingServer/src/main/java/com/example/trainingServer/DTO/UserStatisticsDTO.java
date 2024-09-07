package com.example.trainingServer.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserStatisticsDTO {
    private Long id;
    private int daysInARow;
    private int totalTrainings;
    private int totalExercises;
}