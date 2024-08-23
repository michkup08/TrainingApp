package com.example.trainingServer.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "exercises")
public class Exercise {

    @Id
    @Column(name = "exercise_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long exercise_id;

    @Column(name = "custom")
    private boolean custom;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "default_value")
    private String default_value;

    @OneToMany(mappedBy = "exercise")
    @JsonBackReference
    private Set<ExerciseWithParameters> exercises_With_Parameters;
}
