package com.example.trainingServer.repositories;

import com.example.trainingServer.entities.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    @Query("SELECT c FROM Chat c WHERE " +
            "(c.userOne.userId = :idA AND c.userTwo.userId = :idB) OR " +
            "(c.userOne.userId = :idB AND c.userTwo.userId = :idA)")
    Optional<Chat> findByUsers(@Param("idA") Long idA, @Param("idB") Long idB);

    @Query("SELECT c FROM Chat c WHERE " +
            "(c.userOne.userId = :userId ) OR " +
            "(c.userTwo.userId = :userId)")
    List<Chat> findByUser(@Param("userId") Long userId);
}
