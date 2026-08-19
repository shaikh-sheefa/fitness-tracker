package org.fitness.FitnessTracker.service;

import org.fitness.FitnessTracker.entity.User;
import org.fitness.FitnessTracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Create User
    public User createUser(User user) {
        return userRepository.save(user);
    }

    // Get all Users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get User by ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // Update User
    public User updateUser(Long id, User updatedUser) {

        Optional<User> existingUser = userRepository.findById(id);

        if (existingUser.isPresent()) {

            User user = existingUser.get();

            user.setName(updatedUser.getName());
            user.setEmail(updatedUser.getEmail());
            user.setAge(updatedUser.getAge());
            user.setHeight(updatedUser.getHeight());
            user.setWeight(updatedUser.getWeight());

            return userRepository.save(user);
        }

        return null;
    }

    // Delete User
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}