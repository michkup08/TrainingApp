package com.example.trainingServer.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "posts")
public class Post {
    @Id
    @Column(name = "post_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long post_id;

    @Column(name = "context")
    private String context;

    @ManyToOne
    @JoinColumn(name = "sender_id", referencedColumnName = "user_id")
    @JsonIgnore
    private User senderId;

    @OneToMany
    @JsonIgnore
    private List<Comment> comments;
}
