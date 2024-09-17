package com.example.trainingServer.controller;

import com.example.trainingServer.DTO.UserStatisticsDTO;
import com.example.trainingServer.entities.Role;
import com.example.trainingServer.entities.UserStatistics;
import com.example.trainingServer.functionalities.AuthTokenGenerator;
import com.example.trainingServer.mapper.UserStatisticsMapper;
import com.example.trainingServer.repositories.UserStatisticsRepository;
import com.example.trainingServer.reqAndResp.IdAndNameReqResp;
import com.example.trainingServer.requests.LoginRequest;
import com.example.trainingServer.entities.User;
import com.example.trainingServer.repositories.UserRepository;
import com.example.trainingServer.requests.RegisterRequest;
import com.example.trainingServer.responses.AuthResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final UserStatisticsRepository userStatisticsRepository;
    private final UserStatisticsMapper userStatisticsMapper;


    @PostMapping("/login")
    AuthResponse login(@RequestBody LoginRequest loginRequest)
    {
        List<User> correctLogins = userRepository.findByLogin(loginRequest.getLogin());
        if(correctLogins.isEmpty())
        {
            return new AuthResponse(0, null, null, null, null, null,  null);
        }
        for(User user : correctLogins)
        {
            try {
                MessageDigest messagedigest = MessageDigest.getInstance("MD5");
                messagedigest.update(loginRequest.getPassword().getBytes());
                byte[] digest = messagedigest.digest();
                StringBuilder stringBuilder = new StringBuilder();
                for(byte b : digest)
                {
                    stringBuilder.append(String.format("%02x", b));
                }
                if(stringBuilder.toString().equals(user.getPassword()))
                {
                    String newToken = AuthTokenGenerator.generateToken();
                    user.setAuthToken(newToken);
                    userRepository.save(user);
                    return new AuthResponse(user.getUserId(), user.getLogin(), user.getEmail(), user.getRole(), user.getName(), user.getSurname(), user.getAuthToken());
                }
            }
            catch(NoSuchAlgorithmException e)
            {
                e.printStackTrace();
            }
        }
        return new AuthResponse(0, null, null, null, null, null, null);
    }

    @PostMapping("/register")
    AuthResponse register(@RequestBody RegisterRequest registerRequest)
    {
        try
        {
            MessageDigest messagedigest = MessageDigest.getInstance("MD5");
            messagedigest.update(registerRequest.getPassword().getBytes());
            byte[] digest = messagedigest.digest();
            StringBuilder stringBuilder = new StringBuilder();
            for(byte b : digest)
            {
                stringBuilder.append(String.format("%02x", b));
            }
            String newToken = AuthTokenGenerator.generateToken();

            Role role = Role.valueOf(registerRequest.getRole().toUpperCase());
            UserStatistics userStatistics = new UserStatistics();
            userStatisticsRepository.saveAndFlush(userStatistics);
            User newUser = new User(registerRequest.getLogin(), stringBuilder.toString(), registerRequest.getEmail(), role, registerRequest.getName(), registerRequest.getSurname(), newToken);
            newUser.setUserStatistics(userStatistics);
            newUser = userRepository.saveAndFlush(newUser);
            return new AuthResponse(newUser.getUserId(), newUser.getLogin(), newUser.getEmail(), newUser.getRole(), newUser.getName(), newUser.getSurname(), newUser.getAuthToken());
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        return new AuthResponse(0, null, null, null, null, null, null);
    }

    @GetMapping("/authorization/{authToken}")
    AuthResponse authorize(@PathVariable String authToken)
    {
        try
        {
            User found = userRepository.findByAuthToken(authToken);
            if(found != null) {
                return new AuthResponse(found.getUserId(), found.getLogin(), found.getEmail(), found.getRole(), found.getName(), found.getSurname(), found.getAuthToken());
            }
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        return new AuthResponse(0, null, null, null, null, null, null);
    }

    @GetMapping("/userStatistics/{userId}")
    UserStatisticsDTO getUserStatistics(@PathVariable long userId)
    {
        try
        {
            UserStatistics userStatistics = userStatisticsRepository.findByUser(userRepository.findByUserId(userId));
            if(userStatistics != null) {
                return userStatisticsMapper.toDTO(userStatistics);
            }
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        return new UserStatisticsDTO((long)0,0,0,0);
    }

    @GetMapping("/usersByReg/{fragment}")
    List<IdAndNameReqResp> getUsersByNameFragment(@PathVariable String fragment)
    {
        try
        {
            String reg = "[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]*"+fragment+"[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]*";
            Pattern pattern = Pattern.compile(reg);
            List<User> all = userRepository.findAll();
            List<IdAndNameReqResp> fits = new ArrayList<>();
            for(User user: all)
            {
                if(fits.size()>=20)
                {
                    break;
                }
                Matcher matcher = pattern.matcher(user.getName()+" "+user.getSurname());
                if(matcher.matches())
                {
                    fits.add(new IdAndNameReqResp(user.getName() + " " + user.getSurname(), user.getUserId()));
                }
            }
            return fits;
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        return new ArrayList<>();
    }

    @GetMapping("/getFullNameById/{userId}")
    String getFullName(@PathVariable long userId)
    {
        User user = userRepository.findByUserId(userId);
        return user.getName()+" "+user.getSurname();
    }

    @PostMapping("/image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file selected");
        }
        try {
            Path path = Paths.get("trainingServer/src/postsImages/" + file.getOriginalFilename());
            Files.write(path, file.getBytes());
            return ResponseEntity.ok("File uploaded successfully: " + file.getOriginalFilename());
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error while uploading file");
        }
    }
}
