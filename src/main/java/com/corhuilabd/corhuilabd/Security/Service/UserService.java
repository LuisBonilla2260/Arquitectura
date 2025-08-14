package com.corhuilabd.corhuilabd.Security.Service;

import com.corhuilabd.corhuilabd.Security.UserRepository;
import com.corhuilabd.corhuilabd.Security.User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
    }

    public List<User> allUsers() {
        List<User> users = new ArrayList<>();
        userRepository.findAll().forEach(users::add);
        return users;
    }


}