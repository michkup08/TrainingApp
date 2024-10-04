package com.example.trainingServer.mapper;

import com.example.trainingServer.DTO.PostDTO;
import com.example.trainingServer.entities.Post;
import org.springframework.stereotype.Component;

@Component
public class PostMapper {

    public PostDTO toDTO(Post post) {
        PostDTO dto = new PostDTO();
        dto.setId(post.getPost_id());
        dto.setSenderId(post.getSenderId().getUserId());
        dto.setContext(post.getContext());
        dto.setDateTime(post.getDateTime());
        return dto;
    }

    public Post toEntity(PostDTO postDTO) {
        Post post = new Post();
        if(postDTO.getId()!=0) {
            post.setPost_id(postDTO.getId());
        }
        post.setContext(postDTO.getContext());
        return post;
    }
}