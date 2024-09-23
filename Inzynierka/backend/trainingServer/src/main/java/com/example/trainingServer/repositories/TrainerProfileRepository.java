package com.example.trainingServer.repositories;

import com.example.trainingServer.entities.TrainerProfile;
import com.example.trainingServer.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainerProfileRepository extends JpaRepository<TrainerProfile, Long> {
  public TrainerProfile findByUser(User user);
}
