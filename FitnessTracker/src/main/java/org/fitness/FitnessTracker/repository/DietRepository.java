package org.fitness.FitnessTracker.repository;

import org.fitness.FitnessTracker.entity.Diet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DietRepository extends JpaRepository<Diet, Long> {

    List<Diet> findByUserId(Long userId);

    List<Diet> findByUserIdAndMealDate(
            Long userId,
            LocalDate mealDate
    );
}