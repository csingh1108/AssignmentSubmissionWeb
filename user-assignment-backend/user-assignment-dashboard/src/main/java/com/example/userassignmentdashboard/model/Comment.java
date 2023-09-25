package com.example.userassignmentdashboard.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="comments")
public class Comment {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime createdDate;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User createdBy;
    @Column(columnDefinition = "TEXT")
    private String content;
    @JsonIgnore
    @ManyToOne
    private Assignment assignment;

}
