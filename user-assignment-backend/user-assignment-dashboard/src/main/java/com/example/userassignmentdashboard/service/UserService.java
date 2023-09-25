package com.example.userassignmentdashboard.service;

import com.example.userassignmentdashboard.model.User;
import com.example.userassignmentdashboard.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    public Optional<User> findUserByUsername(String username){
        return userRepository.findByUsername(username);
    }
}
