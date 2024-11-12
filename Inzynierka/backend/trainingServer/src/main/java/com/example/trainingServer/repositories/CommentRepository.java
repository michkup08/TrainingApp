package com.example.trainingServer.repositories;

import com.example.trainingServer.entities.Comment;
import com.example.trainingServer.entities.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByPost(Post post, Pageable pageable);

    @Query("SELECT c FROM Comment c WHERE c.post.post_id = :post ORDER BY STR_TO_DATE(c.dateTime, '%d-%m-%Y %H:%i:%s') DESC")
    Page<Comment> findByPostSortedByDateTime(@Param("post") Long postId, Pageable pageable);
}
