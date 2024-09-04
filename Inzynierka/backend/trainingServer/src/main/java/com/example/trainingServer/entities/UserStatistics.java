package com.example.trainingServer.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.bind.DefaultValue;

@Getter
@Setter
@Entity
@Table(name = "user_statistics")
public class UserStatistics {
    @Id
    @Column(name = "user_statistics_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userStatisticsId;

    @OneToOne(mappedBy = "userStatistics")
    @JsonIgnore
    private User user;

    @Column(name = "days_in_a_row", nullable = false, columnDefinition = "int default 0")
    private int daysInARow;

    @Column(name = "totalTrainings", nullable = false, columnDefinition = "int default 0")
    private int totalTrainings;

    @Column(name = "totalExercises", nullable = false, columnDefinition = "int default 0")
    private int totalExercises;
}
