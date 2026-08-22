package org.fitness.FitnessTracker.repository;

import org.fitness.FitnessTracker.entity.Workout;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkoutRepository extends JpaRepository<Workout, Long> {
}