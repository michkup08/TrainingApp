package com.example.trainingServer.controller;

import com.example.trainingServer.DTO.UserDTO;
import com.example.trainingServer.DTO.UserStatisticsDTO;
import com.example.trainingServer.entities.Role;
import com.example.trainingServer.entities.TrainerProfile;
import com.example.trainingServer.entities.UserStatistics;
import com.example.trainingServer.functionalities.AuthTokenGenerator;
import com.example.trainingServer.mapper.UserMapper;
import com.example.trainingServer.mapper.UserStatisticsMapper;
import com.example.trainingServer.repositories.TrainerProfileRepository;
import com.example.trainingServer.repositories.UserStatisticsRepository;
import com.example.trainingServer.reqAndResp.IdAndNameReqResp;
import com.example.trainingServer.requests.LoginRequest;
import com.example.trainingServer.entities.User;
import com.example.trainingServer.repositories.UserRepository;
import com.example.trainingServer.requests.RegisterRequest;
import com.example.trainingServer.requests.UpdateUserRequest;
import com.example.trainingServer.responses.AuthResponse;
import lombok.AllArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
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
    private final TrainerProfileRepository trainerProfileRepository;

    private final UserMapper userMapper;

    @PostMapping("/login")
    AuthResponse login(@RequestBody LoginRequest loginRequest)
    {
        List<User> correctLogins = userRepository.findByLogin(loginRequest.getLogin());
        if(correctLogins.isEmpty())
        {
            return new AuthResponse(-1, null, null, null, null, null,  null);
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
        return new AuthResponse(-1, null, null, null, null, null, null);
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
            userRepository.saveAndFlush(newUser);
            if(role.equals(Role.TRAINER))
            {
                TrainerProfile trainerProfile = new TrainerProfile(registerRequest.getDescription(), registerRequest.getPrice(), registerRequest.getAvailability());
                trainerProfile.setUser(newUser);
                trainerProfileRepository.saveAndFlush(trainerProfile);
                newUser.setTrainer_profile(trainerProfile);
            }
            newUser.setUserStatistics(userStatistics);
            newUser = userRepository.saveAndFlush(newUser);
            return new AuthResponse(newUser.getUserId(), newUser.getLogin(), newUser.getEmail(), newUser.getRole(), newUser.getName(), newUser.getSurname(), newUser.getAuthToken());
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        return new AuthResponse(-1, null, null, null, null, null, null);
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
        return new AuthResponse(-1, null, null, null, null, null, null);
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
            Pattern pattern = Pattern.compile(reg, Pattern.CASE_INSENSITIVE);
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

    @GetMapping("/getById/{userId}")
    UserDTO getUser(@PathVariable long userId)
    {
        User user = userRepository.findByUserId(userId);
        return userMapper.toUserDTO(user);
    }

    @PostMapping("/image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file selected");
        }
        try {
            Path path = Paths.get("trainingServer/src/profileImages/" + file.getOriginalFilename());
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
            Path possiblePath = Paths.get("trainingServer/src/profileImages/" + filename + extension);
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
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/updateUser")
    public String updateUser(@RequestBody UpdateUserRequest updateUserRequest)
    {
        try {
            MessageDigest messagedigest = MessageDigest.getInstance("MD5");
            User user = userRepository.findByUserId(updateUserRequest.getUserId());
            messagedigest.update(updateUserRequest.getOldPassword().getBytes());
            byte[] digestOld = messagedigest.digest();
            StringBuilder stringBuilderOld = new StringBuilder();
            for(byte b : digestOld)
            {
                stringBuilderOld.append(String.format("%02x", b));
            }
            user.setPassword(stringBuilderOld.toString());
            if(stringBuilderOld.toString().equals(user.getPassword()))
            {
                if(!updateUserRequest.getPassword().isEmpty())
                {

                    messagedigest.update(updateUserRequest.getPassword().getBytes());
                    byte[] digest = messagedigest.digest();
                    StringBuilder stringBuilder = new StringBuilder();
                    for(byte b : digest)
                    {
                        stringBuilder.append(String.format("%02x", b));
                    }
                    user.setPassword(stringBuilder.toString());
                }
                if(!updateUserRequest.getLogin().isEmpty())
                {
                    user.setLogin(updateUserRequest.getLogin());
                }
                if(!updateUserRequest.getEmail().isEmpty())
                {
                    user.setEmail(updateUserRequest.getEmail());
                }
                if(updateUserRequest.getRole().equals("TRAINER"))
                {
                    TrainerProfile trainerProfile = trainerProfileRepository.getReferenceById(updateUserRequest.getTrainerProfileId());
                    if(!updateUserRequest.getDescription().isEmpty())
                    {
                        trainerProfile.setDescriptions(updateUserRequest.getDescription());
                    }
                    if(!updateUserRequest.getPrice().isEmpty())
                    {
                        trainerProfile.setOffer(updateUserRequest.getPrice());
                    }
                    if(!updateUserRequest.getAvailability().isEmpty())
                    {
                        trainerProfile.setAvailability(updateUserRequest.getAvailability());
                    }
                    trainerProfileRepository.saveAndFlush(trainerProfile);
                }
                userRepository.saveAndFlush(user);
                return "User updated successfully";
            }
            return "Password does not match";
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return "Error during update";
    }
}
