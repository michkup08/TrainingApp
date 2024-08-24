package com.example.trainingServer.repositories;

import com.example.trainingServer.entities.Exercise;
import com.example.trainingServer.entities.Training;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainingRepository extends JpaRepository<Training, Long> {

    @Query("update Training " +
            "set complete_percent = :newVal " +
            "where training_id = :trainingId")
    @Modifying
    @Transactional
    void setCompletePercent(@Param("newVal") int percent, @Param("trainingId") long trainingId);
}
