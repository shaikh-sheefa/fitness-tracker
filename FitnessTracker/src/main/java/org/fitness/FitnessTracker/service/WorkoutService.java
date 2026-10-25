package org.fitness.FitnessTracker.service;

import org.fitness.FitnessTracker.dto.WorkoutDTO;
import org.fitness.FitnessTracker.entity.User;
import org.fitness.FitnessTracker.entity.Workout;
import org.fitness.FitnessTracker.repository.UserRepository;
import org.fitness.FitnessTracker.repository.WorkoutRepository;
import org.springframework.stereotype.Service;
import org.fitness.FitnessTracker.service.NotificationClient;
import org.fitness.FitnessTracker.exception.ResourceNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final UserRepository userRepository;
    private final NotificationClient notificationClient;

    public WorkoutService(
            WorkoutRepository workoutRepository,
            UserRepository userRepository,
            NotificationClient notificationClient) {

        this.workoutRepository = workoutRepository;
        this.userRepository = userRepository;
        this.notificationClient = notificationClient;
    }

    // CREATE
    public WorkoutDTO createWorkout(WorkoutDTO workoutDTO) {

        Workout workout = new Workout();

        User user = userRepository
                .findById(workoutDTO.getUserId())
                .orElse(null);

        if (user == null) {
            return null;
        }

        workout.setUser(user);

        workout.setWorkoutType(workoutDTO.getWorkoutType());
        workout.setDuration(workoutDTO.getDuration());
        workout.setCaloriesBurned(workoutDTO.getCaloriesBurned());
        workout.setWorkoutDate(workoutDTO.getWorkoutDate());

        Workout savedWorkout = workoutRepository.save(workout);

        workoutDTO.setId(savedWorkout.getId());

// Send notification after saving the workout
        try {
            notificationClient.sendNotification(
                    "sheefa@example.com",
                    "Workout added successfully: "
                            + savedWorkout.getWorkoutType()
                            + " for "
                            + savedWorkout.getDuration()
                            + " minutes."
            );
        } catch (Exception e) {
            System.out.println("Notification failed: " + e.getMessage());
        }

        return workoutDTO;
    }

    // READ ALL
    public List<WorkoutDTO> getAllWorkouts() {

        return workoutRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // GET WORKOUTS BY USER
    public List<WorkoutDTO> getWorkoutsByUserId(Long userId) {

        return workoutRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // READ ONE

    public WorkoutDTO getWorkoutById(Long id) {

        return workoutRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Workout " + id + " not found"));
    }


    // UPDATE

    public WorkoutDTO updateWorkout(Long id, WorkoutDTO workoutDTO) {

        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Workout " + id + " not found"));

        User user = userRepository
                .findById(workoutDTO.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User " + workoutDTO.getUserId() + " not found"));

        workout.setUser(user);
        workout.setWorkoutType(workoutDTO.getWorkoutType());
        workout.setDuration(workoutDTO.getDuration());
        workout.setCaloriesBurned(workoutDTO.getCaloriesBurned());
        workout.setWorkoutDate(workoutDTO.getWorkoutDate());

        Workout updatedWorkout = workoutRepository.save(workout);

        return convertToDTO(updatedWorkout);
    }


    // DELETE

    public void deleteWorkout(Long id) {

        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Workout " + id + " not found"));

        workoutRepository.delete(workout);
    }

    // ENTITY → DTO
    private WorkoutDTO convertToDTO(Workout workout) {

        WorkoutDTO dto = new WorkoutDTO();

        dto.setId(workout.getId());
        dto.setWorkoutType(workout.getWorkoutType());
        dto.setDuration(workout.getDuration());
        dto.setCaloriesBurned(workout.getCaloriesBurned());
        dto.setWorkoutDate(workout.getWorkoutDate());
        if (workout.getUser() != null) {
            dto.setUserId(workout.getUser().getId());
        }
        return dto;
    }
}