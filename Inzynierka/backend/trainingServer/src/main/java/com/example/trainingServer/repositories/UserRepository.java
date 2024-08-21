package com.example.trainingServer.repositories;

import com.example.trainingServer.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User findByUserId(int userId);

    List<User> findByLogin(String login);

    User findByName(String name);

    User findByAuthToken(String authToken);
}
