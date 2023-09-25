package com.example.userassignmentdashboard.service;

import com.example.userassignmentdashboard.model.User;
import com.example.userassignmentdashboard.repo.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Optional<User> optionalUser= userRepository.findByUsername(username);

        return optionalUser.orElseThrow(() -> new UsernameNotFoundException("Invalid Credentials"));
    }
}
