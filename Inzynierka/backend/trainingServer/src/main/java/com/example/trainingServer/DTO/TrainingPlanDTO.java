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
public class TrainingPlanDTO {
    private int id;
    private String name;
    List<TrainingDTO> trainingPlanDTOs;
}
