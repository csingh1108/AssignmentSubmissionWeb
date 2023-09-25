package com.example.userassignmentdashboard.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer number;

    private String status;

    private String githubUrl;

    private String branch;

    private String codeReviewUrl;

    @ManyToOne
    private User codeReviewer;

    @ManyToOne(optional = false)
    private User user;



}
