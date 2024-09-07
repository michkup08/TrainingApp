package com.example.trainingServer.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Setter
@Getter
@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(name = "user_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userId;

    @Column(name = "login", nullable = false)
    private String login;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "email")
    private String email;

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "surname", nullable = false)
    private String surname;

    @Column(name = "auth_token")
    private String authToken;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    //@JoinColumn(name = "training_plan_id")
    private Set<TrainingPlan> training_plans;

    @OneToOne(mappedBy = "userActivated")
    @JsonIgnore
    //@JoinColumn(name = "training_plan_id")
    private TrainingPlan activePlan;

    @OneToOne
    @JsonIgnore
    @JoinColumn(name = "user_statistics_id")
    private UserStatistics userStatistics;

    @OneToOne
    @JsonIgnore
    @JoinColumn(name = "trainer_profile_id")
    private TrainerProfile trainer_profile;

    @OneToMany
    @JsonIgnore
    @JoinColumn(name = "post_id")
    private List<Post> post;

    @OneToMany
    @JsonIgnore
    @JoinColumn(name = "post_id")
    private Set<Post> posts;

    public User() {
    }

    public User(String login, String password, String email, Role role, String name, String surname, String authToken) {
        this.login = login;
        this.password = password;
        this.email = email;
        this.role = role;
        this.name = name;
        this.surname = surname;
        this.authToken = authToken;
    }

}

