package com.example.trainingServer.controller;

import com.example.trainingServer.DTO.PostDTO;
import com.example.trainingServer.DTO.ReportDTO;
import com.example.trainingServer.entities.Post;
import com.example.trainingServer.entities.Report;
import com.example.trainingServer.entities.User;
import com.example.trainingServer.mapper.CommentMapper;
import com.example.trainingServer.mapper.MessageMapper;
import com.example.trainingServer.mapper.PostMapper;
import com.example.trainingServer.mapper.ReportMapper;
import com.example.trainingServer.repositories.*;
import com.example.trainingServer.service.PostService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/reports")
@AllArgsConstructor
public class ReportController {

    private final PostRepository postRepository;
    private final PostMapper postMapper;
    private final CommentMapper commentMapper;
    private final CommentRepository commentRepository;
    private final MessageMapper messageMapper;
    private final MessageRepository messageRepository;
    private final ReportRepository reportRepository;
    private final PostService postService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<ReportDTO>> getAllReports() {
        List<Report> reports = reportRepository.findAll();
        List<ReportDTO> reportDTOs = reports.stream()
                .filter(report -> !report.isChecked())
                .map(ReportMapper::toDTO)
                .collect(Collectors.toList());
        for (ReportDTO reportDTO : reportDTOs) {
            if(reportDTO.getCommunicateType().equals("POST")) {
                Post post = postRepository.findById(reportDTO.getCommunicateId()).get();
                PostDTO postDTO = postMapper.toDTO(post);
                String image = postService.getBase64ImageForPost(post);
                postDTO.setImage(image);
                reportDTO.setInvalidPostDTO(Optional.of(postDTO));
            } else if (reportDTO.getCommunicateType().equals("COMMENT")) {
                reportDTO.setInvalidCommentDTO(Optional.of(commentMapper.toDTO(commentRepository.findById(reportDTO.getCommunicateId()).get())));
            } else {
                reportDTO.setInvalidMessageDTO(Optional.of(messageMapper.toDTO(messageRepository.findById(reportDTO.getCommunicateId()).get())));
            }
        }
        return ResponseEntity.ok(reportDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportDTO> getReportById(@PathVariable long id) {
        Optional<Report> report = reportRepository.findById(id);
        if (report.isPresent()) {
            return ResponseEntity.ok(ReportMapper.toDTO(report.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<ReportDTO> createReport(@RequestBody ReportDTO reportDTO) {
        Report newReport = ReportMapper.toEntity(reportDTO, reportDTO.getReportedFullName());
        reportRepository.saveAndFlush(newReport);
        return ResponseEntity.ok(ReportMapper.toDTO(newReport));
    }

    @PutMapping("/checkReportsForUser/{userId}/{blockUser}")
    public ResponseEntity<String> IgnoreReports(@PathVariable long userId, @PathVariable boolean blockUser) {
        List<Report> reports = reportRepository.findAllByReportedId(userId);
        for (Report report : reports) {
            report.setChecked(true);
            reportRepository.saveAndFlush(report);
        }
        if(blockUser)
        {
            User user = userRepository.findById(userId).get();
            user.setAuthToken("*");
        }
        return ResponseEntity.ok("Ok");
    }
}
