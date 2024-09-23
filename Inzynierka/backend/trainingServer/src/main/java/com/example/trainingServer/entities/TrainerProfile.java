package com.example.trainingServer.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "trainer_profile")
public class TrainerProfile {
    @Id
    @Column(name = "trainer_profile_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long trainer_profile_id;

//    @OneToOne(mappedBy = "trainer_profile")
//    @JsonIgnore
//    private User trainer;

    @Column(name = "descriptions")
    private String descriptions;

    @Column(name = "offer")
    private String offer;

    @Column(name = "availability")
    private String availability;

    @OneToOne
    @JsonIgnore
    private User user;

    public TrainerProfile(String descriptions, String offer, String availability) {
        this.descriptions = descriptions;
        this.offer = offer;
        this.availability = availability;
    }

    public TrainerProfile(long id, String descriptions, String offer, String availability) {
        this.trainer_profile_id = id;
        this.descriptions = descriptions;
        this.offer = offer;
        this.availability = availability;
    }

    public TrainerProfile() {}
}
