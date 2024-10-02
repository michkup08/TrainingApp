package com.example.trainingServer.repositories;

import com.example.trainingServer.entities.Like;
import com.example.trainingServer.entities.Post;
import com.example.trainingServer.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {

    List<Like> findBySender(User user);
    List<Like> findByPost(Post post);
    Optional<Like> findBySenderAndPost(User user, Post post);
}
