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

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}