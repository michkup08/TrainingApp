package com.example.trainingServer.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "reports")
public class Reports {

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "comunicateType", nullable = false)
    @Enumerated(EnumType.STRING)
    private ComunicateType comunicateType;

    @Column(name = "comunicate_id", nullable = false)
    private long comunicateId;

    @Column(name = "sender_id")
    private long senderId;

    @Column(name = "reported_id")
    private long reportedId;
}