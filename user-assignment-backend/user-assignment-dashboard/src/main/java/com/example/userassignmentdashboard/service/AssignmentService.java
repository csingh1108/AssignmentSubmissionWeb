package com.example.userassignmentdashboard.service;

import com.example.userassignmentdashboard.enums.AssignmentStatusEnum;
import com.example.userassignmentdashboard.enums.AuthorityEnum;
import com.example.userassignmentdashboard.model.Assignment;
import com.example.userassignmentdashboard.model.User;
import com.example.userassignmentdashboard.repo.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;
import java.util.Set;

@Service
public class AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;
    //Saves new assignment with some preset fields, requires user info
    public Assignment save(User user) {
        Assignment assignment = new Assignment();
        assignment.setStatus(AssignmentStatusEnum.PENDING_SUBMISSION.getStatus());
        assignment.setUser(user);
        assignment.setNumber(findNextAssignmentToSubmit(user));
        assignment.setBranch("");
        assignment.setGithubUrl("");

        return assignmentRepository.save(assignment);
    }

    //Finds total number of assignments by user and returns max +1
    private Integer findNextAssignmentToSubmit(User user) {
        Set<Assignment> assignments = assignmentRepository.findByUser(user);
        if(assignments.isEmpty()){
            return 1;
        }
        Optional<Integer> nextAssignmentNumOpt = assignments.stream()
                .map(Assignment::getNumber)
                .filter(Objects::nonNull) // Filter out null assignment numbers
                .max(Integer::compareTo)
                .map(maxAssignmentNum -> maxAssignmentNum + 1);
        return nextAssignmentNumOpt.orElse(1);
    }

    //Finds user by user info
    public Set<Assignment> findByUser( User user){
        //load assignments for code reviewers
        boolean hasCodeReviewer= user
                .getAuthorities()
                .stream()
                .anyMatch(auth -> AuthorityEnum.ROLE_CODE_REVIEWER
                        .name()
                        .equals(auth
                                .getAuthority()));
        if(hasCodeReviewer){
            return assignmentRepository.findByCodeReviewer(user);
        }else{
        //load assignments for students
        return assignmentRepository.findByUser(user);
        }
    }

    //Finds assignment by Id
    public Optional<Assignment> findById(Long assignmentId) {
        return assignmentRepository.findById(assignmentId);
    }

    //Saves assignment
    public Assignment save(Assignment assignment) {
        return assignmentRepository.save(assignment);
    }
}
