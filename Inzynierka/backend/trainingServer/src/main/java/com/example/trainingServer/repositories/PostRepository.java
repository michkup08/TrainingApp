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

    @Query("select distinct p from Post p " +
            "join p.senderId as s" +
            "p where p.post_id not in :earlierFeched")
    @Transactional
    List<Post> getPosts(@Param("earlierFeched") long[] postsIds, Pageable pageable);

    Page<Post> findBySenderId(@Param("senderId") User senderId, Pageable pageable);
}
