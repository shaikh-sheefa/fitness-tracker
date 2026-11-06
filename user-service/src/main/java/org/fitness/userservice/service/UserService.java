package org.fitness.userservice.service;

import org.fitness.userservice.entity.User;
import org.fitness.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RestClient fitnessTracker;

    public UserService(
            UserRepository userRepository,
            @Value("${services.fitness-tracker.url}") String fitnessTrackerUrl) {
        this.userRepository = userRepository;
        this.fitnessTracker = RestClient.builder().baseUrl(fitnessTrackerUrl).build();
    }
        public List<User> getAllUsers() {
            return userRepository.findAll();
        }
        public Optional<User> getUserById(Long id) {
            return userRepository.findById(id);
        }
        public User createUser(User user) {
            return userRepository.save(user);
        }
    public User updateUser(Long id, User updatedUser) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        existingUser.setName(updatedUser.getName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setAge(updatedUser.getAge());
        existingUser.setHeight(updatedUser.getHeight());
        existingUser.setWeight(updatedUser.getWeight());

        return userRepository.save(existingUser);
    }
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "User not found"));
        // Workouts and meals live in FitnessTracker; remove them first so nothing points at a missing user.
        try {
            fitnessTracker.delete()
                    .uri("/api/fitness/users/{id}", id)
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "FitnessTracker service is unavailable, so the user's workouts and meals could not be removed. The user was not deleted.");
        }
        userRepository.delete(user);
    }
}