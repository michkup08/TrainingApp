package com.example.trainingServer.mapper;

import com.example.trainingServer.DTO.UserStatisticsDTO;
import com.example.trainingServer.entities.UserStatistics;
import org.springframework.stereotype.Component;

@Component
public class UserStatisticsMapper {

    public UserStatisticsDTO toDTO(UserStatistics userStatistics) {
        if (userStatistics == null) {
            return null;
        }

        return new UserStatisticsDTO(
                userStatistics.getUserStatisticsId(),
                userStatistics.getDaysInARow(),
                userStatistics.getTotalTrainings(),
                userStatistics.getTotalExercises()
        );
    }
}
