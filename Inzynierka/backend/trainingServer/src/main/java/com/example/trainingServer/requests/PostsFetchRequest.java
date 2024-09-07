package com.example.trainingServer.requests;

import com.example.trainingServer.DTO.PostDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostsFetchRequest {
    List<PostDTO> posts;
    int limit;
}
