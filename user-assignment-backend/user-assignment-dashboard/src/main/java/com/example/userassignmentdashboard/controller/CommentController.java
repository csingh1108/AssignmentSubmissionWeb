package com.example.userassignmentdashboard.controller;

import com.example.userassignmentdashboard.dto.CommentDto;
import com.example.userassignmentdashboard.model.Comment;
import com.example.userassignmentdashboard.model.User;
import com.example.userassignmentdashboard.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("")
    public ResponseEntity<?> postComment(@RequestBody CommentDto commentDto, @AuthenticationPrincipal User user){
        Comment savedComment= commentService.addComment(commentDto, user);
        return ResponseEntity.ok(savedComment);
    }

    @GetMapping("")
    public ResponseEntity<?> getComments(@AuthenticationPrincipal User user, @RequestParam Long assignmentId){
        Set<Comment> comments = commentService.getCommentsByAssignmentId(assignmentId);
        return ResponseEntity.ok(comments);
    }

    @PutMapping("{commentId}")
    public ResponseEntity<?> updateComment(@RequestBody CommentDto commentDto, @AuthenticationPrincipal User user){
        Comment savedComment= commentService.addComment(commentDto, user);
        return ResponseEntity.ok(savedComment);
    }

    @DeleteMapping("{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId){
        try{
            commentService.deleteComment(commentId);
            return ResponseEntity.noContent().build();
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
