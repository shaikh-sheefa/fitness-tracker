package org.fitness.FitnessTracker.service;

import org.fitness.FitnessTracker.dto.FitnessSummaryDTO;
import org.fitness.FitnessTracker.entity.Diet;
import org.fitness.FitnessTracker.entity.Workout;
import org.fitness.FitnessTracker.repository.DietRepository;
import org.fitness.FitnessTracker.repository.WorkoutRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class FitnessSummaryService {

    private final DietRepository dietRepository;
    private final WorkoutRepository workoutRepository;

    public FitnessSummaryService(
            DietRepository dietRepository,
            WorkoutRepository workoutRepository) {

        this.dietRepository = dietRepository;
        this.workoutRepository = workoutRepository;
    }

    public FitnessSummaryDTO getDailySummary(
            Long userId,
            LocalDate date) {

        List<Diet> diets =
                dietRepository.findByUserIdAndMealDate(userId, date);

        List<Workout> workouts =
                workoutRepository.findByUserIdAndWorkoutDate(userId, date);

        double caloriesConsumed = 0;
        double protein = 0;
        double carbs = 0;
        double fat = 0;
        double fibre = 0;

        for (Diet diet : diets) {

            if (diet.getCalories() != null) {
                caloriesConsumed += diet.getCalories();
            }

            if (diet.getProtein() != null) {
                protein += diet.getProtein();
            }

            if (diet.getCarbs() != null) {
                carbs += diet.getCarbs();
            }

            if (diet.getFat() != null) {
                fat += diet.getFat();
            }

            if (diet.getFibre() != null) {
                fibre += diet.getFibre();
            }
        }

        double caloriesBurned = 0;
        int workoutDuration = 0;

        for (Workout workout : workouts) {

            if (workout.getCaloriesBurned() != null) {
                caloriesBurned += workout.getCaloriesBurned();
            }

            if (workout.getDuration() != null) {
                workoutDuration += workout.getDuration();
            }
        }

        FitnessSummaryDTO summary = new FitnessSummaryDTO();

        summary.setDate(date);
        summary.setCaloriesConsumed(caloriesConsumed);
        summary.setCaloriesBurned(caloriesBurned);
        summary.setNetCalories(
                caloriesConsumed - caloriesBurned
        );
        summary.setProtein(protein);
        summary.setCarbs(carbs);
        summary.setFat(fat);
        summary.setFibre(fibre);
        summary.setWorkoutDuration(workoutDuration);

        return summary;
    }
}