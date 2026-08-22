package org.fitness.FitnessTracker.service;

import org.fitness.FitnessTracker.dto.WorkoutDTO;
import org.fitness.FitnessTracker.entity.User;
import org.fitness.FitnessTracker.entity.Workout;
import org.fitness.FitnessTracker.repository.UserRepository;
import org.fitness.FitnessTracker.repository.WorkoutRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final UserRepository userRepository;

    public WorkoutService(
            WorkoutRepository workoutRepository,
            UserRepository userRepository) {

        this.workoutRepository = workoutRepository;
        this.userRepository = userRepository;
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

        return workoutDTO;
    }

    // READ ALL
    public List<WorkoutDTO> getAllWorkouts() {

        return workoutRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // READ ONE
    public WorkoutDTO getWorkoutById(Long id) {

        return workoutRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    // UPDATE
    public WorkoutDTO updateWorkout(Long id, WorkoutDTO workoutDTO) {

        Workout workout = workoutRepository.findById(id).orElse(null);

        if (workout == null) {
            return null;
        }

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

        Workout updatedWorkout = workoutRepository.save(workout);

        return convertToDTO(updatedWorkout);
    }

    // DELETE
    public void deleteWorkout(Long id) {

        workoutRepository.deleteById(id);
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