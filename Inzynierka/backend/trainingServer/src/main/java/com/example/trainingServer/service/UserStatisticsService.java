package com.example.trainingServer.service;

import com.example.trainingServer.entities.Training;
import com.example.trainingServer.entities.TrainingPlan;
import com.example.trainingServer.entities.User;
import com.example.trainingServer.entities.UserStatistics;
import com.example.trainingServer.repositories.TrainingPlanRepository;
import com.example.trainingServer.repositories.TrainingRepository;
import com.example.trainingServer.repositories.UserRepository;
import com.example.trainingServer.repositories.UserStatisticsRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class UserStatisticsService {

    private UserStatisticsRepository userStatisticsRepository;
    private UserRepository userRepository;
    private TrainingPlanRepository trainingPlanRepository;
    private TrainingRepository trainingRepository;

    @Transactional
    public void updateUserStatistics(long userId)
    {
        int today = LocalDateTime.now().getDayOfWeek().getValue() - 1;
        User user = userRepository.findByUserId(userId);
        TrainingPlan trainingPlan = user.getActivePlan();
        if (trainingPlan == null)
        {
            return;
        }
        int sumOfTrainingsCompletePercent = 0, additionalExercises = 0, additionalTrainings = 0;
        List<Training> trainings = new ArrayList<>();

        for(Training training : trainingPlan.getTrainings())
        {
            if(training.getDay()==today)
            {
                trainings.add(training);
                sumOfTrainingsCompletePercent += training.getComplete_percent();
                if(training.getComplete_percent()>=50)
                {
                    additionalTrainings++;
                }
                additionalExercises += training.getExerciseWithParameters().size() * training.getComplete_percent() / 100;
            }
        }
        if(!trainings.isEmpty())
        {
            UserStatistics userStatistics = user.getUserStatistics();
            if(sumOfTrainingsCompletePercent/trainings.size()>=50)
            {
                userStatistics.setDaysInARow(userStatistics.getDaysInARow()+1);
            }
            else
            {
                userStatistics.setDaysInARow(0);
            }
            userStatistics.setTotalExercises(userStatistics.getTotalExercises()+additionalExercises);
            userStatistics.setTotalTrainings(userStatistics.getTotalTrainings()+additionalTrainings);
            userStatisticsRepository.saveAndFlush(userStatistics);
        }
        if(today==6)
        {
            List<TrainingPlan> plans = trainingPlanRepository.findByUserUserIdExtended(userId);
            for(TrainingPlan plan : plans)
            {
                for(Training training : plan.getTrainings())
                {
                    training.setComplete_percent(0);
                    trainingRepository.saveAndFlush(training);
                }
            }
        }
    }
}
