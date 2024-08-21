package com.example.trainingServer.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "user_statistics")
public class UserStatistics {
    @Id
    @Column(name = "user_statistics_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userStatisticsId; //Or Integer instead of int

    @OneToOne(mappedBy = "userStatistics")
    @JsonIgnore
    private User user;

    @Column(name = "days_in_a_row")
    private int daysInARow;
}
