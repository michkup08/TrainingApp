package com.example.trainingServer.repositories;

import com.example.trainingServer.entities.Exercise;
import com.example.trainingServer.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {


}
