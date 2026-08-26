package org.fitness.FitnessTracker.controller;

import jakarta.validation.Valid;
import org.fitness.FitnessTracker.dto.WorkoutDTO;
import org.fitness.FitnessTracker.service.WorkoutService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {

    private final WorkoutService workoutService;

    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<WorkoutDTO> createWorkout(
            @Valid @RequestBody WorkoutDTO workoutDTO) {

        WorkoutDTO createdWorkout = workoutService.createWorkout(workoutDTO);

        if (createdWorkout == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.status(201).body(createdWorkout);
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<WorkoutDTO>> getAllWorkouts() {

        return ResponseEntity.ok(workoutService.getAllWorkouts());
    }

    // READ ONE
    @GetMapping("/{id}")
    public ResponseEntity<WorkoutDTO> getWorkoutById(
            @PathVariable Long id) {

        WorkoutDTO workoutDTO = workoutService.getWorkoutById(id);

        if (workoutDTO == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(workoutDTO);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<WorkoutDTO> updateWorkout(
            @PathVariable Long id,
            @Valid @RequestBody WorkoutDTO workoutDTO) {

        WorkoutDTO updatedWorkout =
                workoutService.updateWorkout(id, workoutDTO);

        if (updatedWorkout == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedWorkout);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkout(
            @PathVariable Long id) {

        workoutService.deleteWorkout(id);

        return ResponseEntity.noContent().build();
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WorkoutDTO>> getWorkoutsByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(workoutService.getWorkoutsByUserId(userId));
    }
}