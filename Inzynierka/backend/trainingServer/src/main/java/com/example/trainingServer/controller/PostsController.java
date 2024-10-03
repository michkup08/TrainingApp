package com.example.trainingServer.controller;

import com.example.trainingServer.DTO.CommentDTO;
import com.example.trainingServer.DTO.PostDTO;
import com.example.trainingServer.entities.Comment;
import com.example.trainingServer.entities.Like;
import com.example.trainingServer.entities.Post;
import com.example.trainingServer.entities.User;
import com.example.trainingServer.mapper.CommentMapper;
import com.example.trainingServer.mapper.PostMapper;
import com.example.trainingServer.repositories.CommentRepository;
import com.example.trainingServer.repositories.LikeRepository;
import com.example.trainingServer.repositories.PostRepository;
import com.example.trainingServer.repositories.UserRepository;
import com.example.trainingServer.requests.PostsFetchRequest;
import com.example.trainingServer.requests.UserAndObjectIds;
import com.example.trainingServer.service.PostService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/posts")
public class PostsController {

    private final PostRepository postRepository;
    private final LikeRepository likeRepository;

    private final PostMapper postMapper;
    private final CommentMapper commentMapper;

    private final PostService postService;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    @Value("${post-images-dir}")
    private String postImagesDir;

    public PostsController(PostRepository postRepository, PostMapper postMapper, CommentMapper commentMapper, PostService postService, UserRepository userRepository, LikeRepository likeRepository, CommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.postMapper = postMapper;
        this.commentMapper = commentMapper;
        this.postService = postService;
        this.userRepository = userRepository;
        this.likeRepository = likeRepository;
        this.commentRepository = commentRepository;
    }

    @PostMapping("/unicalPosts")
    public List<PostDTO> getNewPosts(@RequestBody PostsFetchRequest postsFetchRequest)
    {
        try {

            Pageable pageable = PageRequest.of(postsFetchRequest.getPage(), 5);
            Page<Post> posts = postRepository.findAll(pageable);
            List<PostDTO> postDTOs = new ArrayList<>();
            for (Post post : posts)
            {
                PostDTO postDTO = postMapper.toDTO(post);
                String image = postService.getBase64ImageForPost(post);
                postDTO.setImage(image);
                User sender = userRepository.findByUserId(post.getSenderId().getUserId());
                postDTO.setSenderFullName(sender.getName()+" "+sender.getSurname());
                List<Like> likes = likeRepository.findByPost(post);
                List<Like> positiveLikes = likes.stream().filter(like -> like.isPositive()).collect(Collectors.toList());
                postDTO.setLikes(positiveLikes.size());
                postDTO.setLiked(positiveLikes.stream().anyMatch(like -> like.getSender().getUserId()==postsFetchRequest.getUserId()));
                postDTOs.add(postDTO);
            }
            return postDTOs;
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return new ArrayList<>();
    }

    @GetMapping("/comments/{postId}/{page}")
    public List<CommentDTO> getComments(@PathVariable Long postId, @PathVariable Integer page)
    {
        try {

            Pageable pageable = PageRequest.of(page, 3);
            Page<Comment> comments = commentRepository.findByPost(postRepository.getReferenceById(postId), pageable);
            List<CommentDTO> commentDTOs = new ArrayList<>();
            for (Comment comment : comments)
            {
                CommentDTO commentDTO = commentMapper.toDTO(comment);
                commentDTOs.add(commentDTO);
            }
            return commentDTOs;
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return new ArrayList<>();
    }

    @PutMapping("/likeDislike")
    public void likeDislike(@RequestBody UserAndObjectIds userAndObjectIds) {
        try {
            Optional<Like> likeOpt = likeRepository.findBySenderAndPost(userRepository.findByUserId(userAndObjectIds.getUserId()), postRepository.findById(userAndObjectIds.getObjectId()).get());
            if(likeOpt.isPresent()) {
                Like like = likeOpt.get();
                like.setPositive(!like.isPositive());
                likeRepository.save(like);
            }
            else {
                Like like = new Like();
                like.setPositive(true);
                like.setPost(postRepository.findById(userAndObjectIds.getObjectId()).get());
                like.setSender(userRepository.findByUserId(userAndObjectIds.getUserId()));
                likeRepository.save(like);
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    @PostMapping("/post")
    public long addPost(@RequestBody PostDTO postsDTO)
    {
        try {
            User sender = userRepository.findByUserId(postsDTO.getSenderId());
            Post newPost = postMapper.toEntity(postsDTO);
            newPost.setSenderId(sender);
            postRepository.saveAndFlush(newPost);
            return newPost.getPost_id();
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

    @PostMapping("/image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file selected");
        }
        try {
            Path path = Paths.get(postImagesDir + file.getOriginalFilename());
            Files.write(path, file.getBytes());
            return ResponseEntity.ok("File uploaded successfully: " + file.getOriginalFilename());
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error while uploading file");
        }
    }

    @GetMapping("/image/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        String[] supportedExtensions = {".jpg", ".jpeg", ".png", ".gif"};
        Path path = null;
        for (String extension : supportedExtensions) {
            Path possiblePath = Paths.get(postImagesDir + filename + extension);
            if (Files.exists(possiblePath)) {
                path = possiblePath;
                break;
            }
        }
        if (path != null && Files.isReadable(path)) {
            try {
                Resource resource = new UrlResource(path.toUri());
                String contentType = Files.probeContentType(path);
                if (resource.exists() && resource.isReadable()) {
                    return ResponseEntity.ok()
                            .contentType(MediaType.parseMediaType(contentType))
                            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                            .body(resource);
                } else {
                    return ResponseEntity.notFound().build();
                }
            }
            catch (MalformedURLException e) {
                return ResponseEntity.status(500).body(null);
            }
            catch (IOException e) {
                return ResponseEntity.status(500).body(null);
            }

        }
        return ResponseEntity.notFound().build();
    }
}
