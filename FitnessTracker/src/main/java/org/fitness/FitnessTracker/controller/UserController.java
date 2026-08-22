package org.fitness.FitnessTracker.controller;

import jakarta.validation.Valid;
import org.fitness.FitnessTracker.dto.UserDTO;
import org.fitness.FitnessTracker.dto.WorkoutDTO;
import org.fitness.FitnessTracker.service.UserService;
import org.fitness.FitnessTracker.service.WorkoutService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final WorkoutService workoutService;

    public UserController(
            UserService userService,
            WorkoutService workoutService) {

        this.userService = userService;
        this.workoutService = workoutService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<UserDTO> createUser(
            @Valid @RequestBody UserDTO userDTO) {

        UserDTO createdUser = userService.createUser(userDTO);

        return ResponseEntity.status(201).body(createdUser);
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {

        return ResponseEntity.ok(userService.getAllUsers());
    }

    // READ ONE
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(
            @PathVariable Long id) {

        UserDTO userDTO = userService.getUserById(id);

        if (userDTO == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(userDTO);
    }

    // GET WORKOUTS FOR USER
    @GetMapping("/{userId}/workouts")
    public ResponseEntity<List<WorkoutDTO>> getUserWorkouts(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                workoutService.getWorkoutsByUserId(userId)
        );
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserDTO userDTO) {

        UserDTO updatedUser = userService.updateUser(id, userDTO);

        if (updatedUser == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedUser);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id) {

        userService.deleteUser(id);

        return ResponseEntity.noContent().build();
    }
}