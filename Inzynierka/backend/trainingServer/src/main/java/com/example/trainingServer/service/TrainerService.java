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
public class TrainerService {

    @Value("${profile-images-dir}")
    private String profileImagesDir;

    public String getBase64ImageForPost(long userId) {
        String[] supportedExtensions = {".jpg", ".jpeg", ".png", ".gif"};
        for (String extension : supportedExtensions) {
            Path possiblePath = Paths.get(profileImagesDir + userId + extension);
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
