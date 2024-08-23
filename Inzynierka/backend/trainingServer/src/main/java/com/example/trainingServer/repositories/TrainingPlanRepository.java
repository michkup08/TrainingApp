package com.example.trainingServer.repositories;

import com.example.trainingServer.entities.TrainingPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainingPlanRepository extends JpaRepository<TrainingPlan, Long> {

    @Query("SELECT DISTINCT tp FROM TrainingPlan tp " +
            "JOIN FETCH tp.trainings as tr " +
            "JOIN FETCH tr.exerciseWithParameters as exe " +
            "WHERE tp.user.userId = :userId")
    List<TrainingPlan> findByUserUserIdExtended(@Param("userId") Long id);

    @Query("SELECT DISTINCT tp FROM TrainingPlan tp " +
            "JOIN FETCH tp.trainings as tr " +
            "JOIN FETCH tr.exerciseWithParameters as exe " +
            "WHERE tp.userActivated.userId = :userId")
    TrainingPlan findByUserActivatedUserIdExtended(@Param("userId") Long id);
}
