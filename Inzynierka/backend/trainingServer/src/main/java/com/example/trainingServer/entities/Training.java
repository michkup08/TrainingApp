package com.example.trainingServer.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.boot.context.properties.bind.DefaultValue;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "trainings")
public class Training {
    @Id
    @Column(name = "training_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long training_id;

    @Column(name = "name")
    private String name;

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.ALL, CascadeType.REMOVE})
    @JsonIgnore
    @JoinTable(
            name = "exercises_with_parameters_training",
            joinColumns = @JoinColumn(name = "training_training_id"),
            inverseJoinColumns = @JoinColumn(name = "exercise_with_parameters_id")
    )
    private List<ExerciseWithParameters> exerciseWithParameters;

    @Column(name = "day")
    private int day;

    @Column(name = "start_time")
    private String start_time;

    @Column(name = "stop_time")
    private String stop_time;

    @Column(name = "complete_percent")
    private int complete_percent;

    @ManyToOne
    @JsonIgnore
    private TrainingPlan trainingPlan;

}
