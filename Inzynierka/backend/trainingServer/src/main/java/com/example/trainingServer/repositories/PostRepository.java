package com.example.trainingServer.repositories;

import com.example.trainingServer.entities.Post;
import com.example.trainingServer.entities.User;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p FROM Post p ORDER BY STR_TO_DATE(p.dateTime, '%d-%m-%Y %H:%i:%s') DESC")
    Page<Post> findAllSortedByDateTime(Pageable pageable);

    Page<Post> findBySenderId(@Param("senderId") User senderId, Pageable pageable);
}
