package org.fitness.FitnessTracker.repository;

import org.fitness.FitnessTracker.entity.Workout;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface WorkoutRepository extends JpaRepository<Workout, Long> {

    List<Workout> findByUserId(Long userId);
    List<Workout> findByUserIdAndWorkoutDate(
            Long userId,
            LocalDate workoutDate
    );
}