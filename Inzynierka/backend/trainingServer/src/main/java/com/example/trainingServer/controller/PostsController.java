package com.example.trainingServer.controller;

import com.example.trainingServer.DTO.PostDTO;
import com.example.trainingServer.entities.Post;
import com.example.trainingServer.entities.User;
import com.example.trainingServer.mapper.PostMapper;
import com.example.trainingServer.repositories.PostRepository;
import com.example.trainingServer.repositories.UserRepository;
import com.example.trainingServer.requests.PostsFetchRequest;
import com.example.trainingServer.service.PostService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
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

@RestController
@RequestMapping("/posts")
public class PostsController {

    private final PostRepository postRepository;

    private final PostMapper postMapper;

    private final PostService postService;
    private final UserRepository userRepository;

    @Value("${post-images-dir}")
    private String postImagesDir;

    public PostsController(PostRepository postRepository, PostMapper postMapper, PostService postService, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.postMapper = postMapper;
        this.postService = postService;
        this.userRepository = userRepository;
    }

    @PostMapping("/unicalPosts")
    public List<PostDTO> getNewPosts(@RequestBody PostsFetchRequest postsFetchRequest)
    {
        try {
            long[] postsIds = new long[postsFetchRequest.getPosts().size()];
            for(int i = 0; i < postsFetchRequest.getPosts().size(); i++)
            {
                postsIds[i] = postsFetchRequest.getPosts().get(i).getId();
            }
            Pageable pageable = PageRequest.of(0, postsFetchRequest.getLimit());
            List<Post> posts = postRepository.getPosts(postsIds, pageable);
            List<PostDTO> postDTOs = new ArrayList<>();
            for (Post post : posts)
            {
                PostDTO postDTO = postMapper.toDTO(post);
                String image = postService.getBase64ImageForPost(post);
                postDTO.setImage(image);
                User sender = userRepository.findByUserId(post.getSenderId().getUserId());
                postDTO.setSenderFullName(sender.getName()+" "+sender.getSurname());
                postDTOs.add(postDTO);
            }
            return postDTOs;
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return new ArrayList<>();
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
