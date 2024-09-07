package com.example.trainingServer.service;

import com.example.trainingServer.entities.Post;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

@Service
public class PostService {

    @Value("${post-images-dir}")
    private String postImagesDir;

    public String getBase64ImageForPost(Post post) {
        String[] supportedExtensions = {".jpg", ".jpeg", ".png", ".gif"};
        for (String extension : supportedExtensions) {
            Path possiblePath = Paths.get(postImagesDir + post.getPost_id() + extension);
            if (Files.exists(possiblePath)) {
                try {
                    byte[] imageBytes = Files.readAllBytes(possiblePath);
                    return Base64.getEncoder().encodeToString(imageBytes);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return null;
    }
}
