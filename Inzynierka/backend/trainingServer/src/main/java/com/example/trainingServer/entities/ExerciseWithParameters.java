package com.example.trainingServer.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "exercises_with_parameters")
public class ExerciseWithParameters {

    @Id
    @Column(name = "exercises_with_parameters_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long exercises_with_parameters_id;

    @Column(name = "parameters")
    private String parameters;

    @ManyToOne
    @JsonBackReference
    private Exercise exercise;

    @ManyToOne
    @JsonBackReference
    private Training training;
}
