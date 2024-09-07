package com.example.trainingServer.mapper;

import com.example.trainingServer.DTO.PostDTO;
import com.example.trainingServer.entities.Post;
import com.example.trainingServer.entities.User;
import org.springframework.stereotype.Component;

@Component
public class PostMapper {

    public PostDTO toDTO(Post post) {
        PostDTO dto = new PostDTO();
        dto.setId(post.getPost_id());
        dto.setSenderId(post.getSenderId().getUserId());
        dto.setContext(post.getContext());
        return dto;
    }

    public Post toEntity(PostDTO postDTO, User sender) {
        Post post = new Post();
        post.setPost_id(postDTO.getId());
        post.setContext(postDTO.getContext());
        post.setSenderId(sender);
        return post;
    }
}