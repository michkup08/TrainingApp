package com.example.trainingServer.repositories;

import com.example.trainingServer.entities.User;
import com.example.trainingServer.entities.UserStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserStatisticsRepository extends JpaRepository<UserStatistics, Long> {

}
