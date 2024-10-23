package com.example.trainingServer.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.Optional;

@Getter
@Setter
public class ReportDTO {
    private long id;
    private String description;
    private String communicateType;
    private long comumnicateId;
    private long senderId;
    private long reportedId;
    private String reportedFullName;
    private boolean checked;
    private Optional<PostDTO> invalidPostDTO;
    private Optional<CommentDTO> invalidCommentDTO;
    private Optional<MessageDTO> invalidMessageDTO;
}
