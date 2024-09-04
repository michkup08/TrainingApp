package com.example.trainingServer.scheduled;

import com.example.trainingServer.repositories.UserRepository;
import com.example.trainingServer.service.UserStatisticsService;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class ScheduledTasks {
    private final UserStatisticsService statisticsService;

    private UserRepository userRepository;

    @Scheduled(cron = "45 11 * * *")
    public void scheduledTasks()
    {
        userRepository.findAll().forEach(user -> {
            statisticsService.updateUserStatistics(user.getUserId());
        });
    }

}
