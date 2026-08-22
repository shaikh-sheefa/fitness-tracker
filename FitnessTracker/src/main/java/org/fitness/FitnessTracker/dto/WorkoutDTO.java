package org.fitness.FitnessTracker.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class WorkoutDTO {

    private Long id;

    @NotBlank(message = "Workout type is required")
    private String workoutType;

    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 minute")
    private Integer duration;

    @NotNull(message = "Calories burned is required")
    @Min(value = 0, message = "Calories burned cannot be negative")
    private Double caloriesBurned;

    @NotNull(message = "Workout date is required")
    private LocalDate workoutDate;

    @NotNull(message = "User ID is required")
    private Long userId;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWorkoutType() {
        return workoutType;
    }

    public void setWorkoutType(String workoutType) {
        this.workoutType = workoutType;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Double getCaloriesBurned() {
        return caloriesBurned;
    }

    public void setCaloriesBurned(Double caloriesBurned) {
        this.caloriesBurned = caloriesBurned;
    }

    public LocalDate getWorkoutDate() {
        return workoutDate;
    }

    public void setWorkoutDate(LocalDate workoutDate) {
        this.workoutDate = workoutDate;

    }
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}