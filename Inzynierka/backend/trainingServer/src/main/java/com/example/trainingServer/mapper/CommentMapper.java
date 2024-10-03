package com.example.trainingServer.mapper;

import com.example.trainingServer.DTO.CommentDTO;
import com.example.trainingServer.entities.Comment;
import com.example.trainingServer.entities.Post;
import com.example.trainingServer.entities.User;
import org.springframework.stereotype.Component;

@Component
public class CommentMapper {

    public CommentDTO toDTO(Comment comment) {
        if (comment == null) {
            return null;
        }

        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getComment_id());
        dto.setSenderId(comment.getSender().getUserId());
        dto.setSenderName(comment.getSender().getName());
        dto.setSenderSurname(comment.getSender().getSurname());
        dto.setPostId(comment.getPost().getPost_id());
        dto.setContent(comment.getContext());

        return dto;
    }

    public Comment toEntity(CommentDTO dto, User sender, Post post) {
        if (dto == null) {
            return null;
        }

        Comment comment = new Comment();
        comment.setComment_id(dto.getId());
        comment.setSender(sender);
        comment.setPost(post);
        comment.setContext(dto.getContent());

        return comment;
    }
}

