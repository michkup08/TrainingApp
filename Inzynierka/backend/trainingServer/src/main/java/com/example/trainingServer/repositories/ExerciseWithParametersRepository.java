package com.example.trainingServer.repositories;

import com.example.trainingServer.entities.ExerciseWithParameters;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ExerciseWithParametersRepository extends JpaRepository<ExerciseWithParameters, Long> {

}
