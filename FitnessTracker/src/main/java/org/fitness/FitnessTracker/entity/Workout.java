package org.fitness.FitnessTracker.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "workouts")
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String workoutType;

    private Integer duration;

    private Double caloriesBurned;

    private LocalDate workoutDate;

    // Id of the user in user-service. Users live in that service, so this is a plain column, not a foreign key.
    @Column(name = "user_id", nullable = false)
    private Long userId;

    public Workout() {
    }

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