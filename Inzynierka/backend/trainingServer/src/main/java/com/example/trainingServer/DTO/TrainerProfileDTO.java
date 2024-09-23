package com.example.trainingServer.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TrainerProfileDTO {
    private long id;
    private String fullName;
    private String email;
    private String profileImage;
    private String description;
    private String price;
    private String availability;

    public TrainerProfileDTO(long id, String description, String price, String availability) {
        this.id = id;
        this.description = description;
        this.price = price;
        this.availability = availability;
    }
}
