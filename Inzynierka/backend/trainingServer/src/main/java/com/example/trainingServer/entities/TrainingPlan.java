package com.example.trainingServer.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "training_plans")
public class TrainingPlan {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "name")
    private String name;

    @ManyToOne
    @JsonIgnore
    private User user;

    @OneToOne
    @JsonIgnore
    private User userActivated;

    @OneToMany(mappedBy = "trainingPlan")
    @JsonIgnore
    private Set<Training> trainings;
}
