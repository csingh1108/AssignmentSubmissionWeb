package com.example.userassignmentdashboard.service;

import com.example.userassignmentdashboard.dto.CommentDto;
import com.example.userassignmentdashboard.model.Assignment;
import com.example.userassignmentdashboard.model.Comment;
import com.example.userassignmentdashboard.model.User;
import com.example.userassignmentdashboard.repo.AssignmentRepository;
import com.example.userassignmentdashboard.repo.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepo;
    @Autowired
    private AssignmentRepository assignmentRepo;

    public Comment addComment(CommentDto commentDto, User user) {
        Comment comment = new Comment();
        Assignment assignment= assignmentRepo.getReferenceById(commentDto.getAssignmentId());

        comment.setId(commentDto.getId());
        comment.setContent(commentDto.getText());
        comment.setCreatedBy(user);
        comment.setAssignment(assignment);
        if(comment.getId() == null){
            comment.setCreatedDate(LocalDateTime.now());
        }else{
            comment.setCreatedDate(commentDto.getCreatedDate());
        }


        return commentRepo.save(comment);
    }

    public Set<Comment> getCommentsByAssignmentId(Long assignmentId) {
        Set<Comment> comments=commentRepo.findByAssignmentId(assignmentId);
        return comments;
    }

    public void deleteComment(Long commentId) {
        commentRepo.deleteById(commentId);
    }
}
