package com.example.userassignmentdashboard.controller;

import com.example.userassignmentdashboard.dto.AssignmentResponseDto;
import com.example.userassignmentdashboard.enums.AuthorityEnum;
import com.example.userassignmentdashboard.model.Assignment;
import com.example.userassignmentdashboard.model.User;
import com.example.userassignmentdashboard.service.AssignmentService;
import com.example.userassignmentdashboard.service.UserService;
import com.example.userassignmentdashboard.util.AuthorityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private UserService userService;

    //Create new Assignment
    @PostMapping("")
    public ResponseEntity<?> createAssignment(@AuthenticationPrincipal User user){
        Assignment newAssignment = assignmentService.save(user);
        return ResponseEntity.ok(newAssignment);
    }

    //Get all assignments by user
    @GetMapping("")
    public ResponseEntity<?> getAssignments(@AuthenticationPrincipal User user){
        Set<Assignment> assignmentsByUser = assignmentService.findByUser(user);
        return ResponseEntity.ok(assignmentsByUser);
    }

    //Find Assignment by id, requires assignment Id and authenticated user info
    @GetMapping("{assignmentId}")
    public ResponseEntity<?> getAssignments(@PathVariable Long assignmentId, @AuthenticationPrincipal User user){
        Optional<Assignment> assignmentOpt = assignmentService.findById(assignmentId);

        return ResponseEntity.ok(new AssignmentResponseDto(assignmentOpt.orElse(new Assignment())));
    }

    //Update assignment, requires assignment ID and authenticated user info
    @PutMapping("{assignmentId}")
    public ResponseEntity<?> updateAssignments(@PathVariable Long assignmentId,
                                               @RequestBody Assignment assignment,
                                               @AuthenticationPrincipal User user){
        if(assignment.getCodeReviewer() != null){
            User codeReviewer = assignment.getCodeReviewer();
            codeReviewer = userService.findUserByUsername(codeReviewer.getUsername()).orElse(new User());

            if(AuthorityUtil.hasRole(AuthorityEnum.ROLE_CODE_REVIEWER.name(), codeReviewer)) {
                assignment.setCodeReviewer(codeReviewer);
            }
        }
        Assignment updatedAssignment = assignmentService.save(assignment);
        return ResponseEntity.ok(updatedAssignment);
    }
}
