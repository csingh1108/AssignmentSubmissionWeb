package com.example.userassignmentdashboard.repo;

import com.example.userassignmentdashboard.model.Assignment;
import com.example.userassignmentdashboard.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import java.util.Set;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    Set<Assignment> findByUser(User user);

    @Query("select a from Assignment a " +
            "where (a.status= 'SUBMITTED'" +
            "and (a.codeReviewer is null or a.codeReviewer = :codeReviewer))" +
            "or a.codeReviewer = :codeReviewer")
    Set<Assignment> findByCodeReviewer(User codeReviewer);
}

