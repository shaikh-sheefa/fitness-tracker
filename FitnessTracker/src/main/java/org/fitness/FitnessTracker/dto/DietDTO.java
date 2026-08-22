package org.fitness.FitnessTracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;

public class DietDTO {

    private Long id;

    @NotBlank(message = "Meal type is required")
    private String mealType;

    @NotBlank(message = "Food name is required")
    private String foodName;

    @NotNull(message = "Calories are required")
    @Positive(message = "Calories must be greater than 0")
    private Double calories;

    @NotNull(message = "Protein is required")
    @Positive(message = "Protein must be greater than 0")
    private Double protein;

    @NotNull(message = "Carbs are required")
    @Positive(message = "Carbs must be greater than 0")
    private Double carbs;

    @NotNull(message = "Fat is required")
    @Positive(message = "Fat must be greater than 0")
    private Double fat;

    @NotNull(message = "Fibre is required")
    @PositiveOrZero(message = "Fibre cannot be negative")
    private Double fibre;

    @NotNull(message = "Meal date is required")
    private LocalDate mealDate;

    @NotNull(message = "User ID is required")
    private Long userId;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMealType() {
        return mealType;
    }

    public void setMealType(String mealType) {
        this.mealType = mealType;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public Double getCalories() {
        return calories;
    }

    public void setCalories(Double calories) {
        this.calories = calories;
    }

    public Double getProtein() {
        return protein;
    }

    public void setProtein(Double protein) {
        this.protein = protein;
    }

    public Double getCarbs() {
        return carbs;
    }

    public void setCarbs(Double carbs) {
        this.carbs = carbs;
    }

    public Double getFat() {
        return fat;
    }

    public void setFat(Double fat) {
        this.fat = fat;
    }

    public Double getFibre() {
        return fibre;
    }

    public void setFibre(Double fibre) {
        this.fibre = fibre;
    }

    public LocalDate getMealDate() {
        return mealDate;
    }

    public void setMealDate(LocalDate mealDate) {
        this.mealDate = mealDate;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}