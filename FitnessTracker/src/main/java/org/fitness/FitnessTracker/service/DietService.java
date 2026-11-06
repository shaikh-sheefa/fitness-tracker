package org.fitness.FitnessTracker.service;

import org.fitness.FitnessTracker.dto.DietDTO;
import org.fitness.FitnessTracker.entity.Diet;
import org.fitness.FitnessTracker.repository.DietRepository;
import org.fitness.FitnessTracker.client.UserClient;
import org.springframework.stereotype.Service;
import org.fitness.FitnessTracker.dto.NutritionSummaryDTO;
import org.fitness.FitnessTracker.exception.ResourceNotFoundException;

import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDate;

@Service
public class DietService {

    private final DietRepository dietRepository;
    private final UserClient userClient;

    public DietService(
            DietRepository dietRepository,
            UserClient userClient) {

        this.dietRepository = dietRepository;
        this.userClient = userClient;
    }

    // CREATE
    public DietDTO createDiet(DietDTO dietDTO) {

        Diet diet = new Diet();

        userClient.ensureUserExists(dietDTO.getUserId());
        diet.setUserId(dietDTO.getUserId());
        diet.setMealType(dietDTO.getMealType());
        diet.setFoodName(dietDTO.getFoodName());
        diet.setCalories(dietDTO.getCalories());
        diet.setProtein(dietDTO.getProtein());
        diet.setCarbs(dietDTO.getCarbs());
        diet.setFat(dietDTO.getFat());
        diet.setFibre(dietDTO.getFibre());
        diet.setMealDate(dietDTO.getMealDate());

        Diet savedDiet = dietRepository.save(diet);

        return convertToDTO(savedDiet);
    }

    // READ ALL
    public List<DietDTO> getAllDiets() {

        return dietRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // READ ONE

    public DietDTO getDietById(Long id) {

        return dietRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Diet " + id + " not found"));
    }


    // GET DIETS BY USER
    public List<DietDTO> getDietsByUserId(Long userId) {

        return dietRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    // DAILY NUTRITION SUMMARY
    public NutritionSummaryDTO getDailyNutritionSummary(
            Long userId,
            LocalDate date) {

        List<Diet> diets =
                dietRepository.findByUserIdAndMealDate(userId, date);

        NutritionSummaryDTO summary = new NutritionSummaryDTO();

        summary.setDate(date);

        double totalCalories = 0;
        double totalProtein = 0;
        double totalCarbs = 0;
        double totalFat = 0;
        double totalFibre = 0;

        for (Diet diet : diets) {

            totalCalories += diet.getCalories();
            totalProtein += diet.getProtein();
            totalCarbs += diet.getCarbs();
            totalFat += diet.getFat();
            if (diet.getFibre() != null) {
                totalFibre += diet.getFibre();
            }
        }

        summary.setTotalCalories(totalCalories);
        summary.setTotalProtein(totalProtein);
        summary.setTotalCarbs(totalCarbs);
        summary.setTotalFat(totalFat);
        summary.setTotalFibre(totalFibre);

        return summary;
    }


    // UPDATE

    public DietDTO updateDiet(Long id, DietDTO dietDTO) {

        Diet diet = dietRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Diet " + id + " not found"));

        userClient.ensureUserExists(dietDTO.getUserId());
        diet.setUserId(dietDTO.getUserId());
        diet.setMealType(dietDTO.getMealType());
        diet.setFoodName(dietDTO.getFoodName());
        diet.setCalories(dietDTO.getCalories());
        diet.setProtein(dietDTO.getProtein());
        diet.setCarbs(dietDTO.getCarbs());
        diet.setFat(dietDTO.getFat());
        diet.setFibre(dietDTO.getFibre());
        diet.setMealDate(dietDTO.getMealDate());

        Diet updatedDiet = dietRepository.save(diet);

        return convertToDTO(updatedDiet);
    }


    // DELETE
    public void deleteDiet(Long id) {

        Diet diet = dietRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Diet " + id + " not found"));

        dietRepository.delete(diet);
    }


    // ENTITY → DTO
    private DietDTO convertToDTO(Diet diet) {

        DietDTO dto = new DietDTO();

        dto.setId(diet.getId());
        dto.setMealType(diet.getMealType());
        dto.setFoodName(diet.getFoodName());
        dto.setCalories(diet.getCalories());
        dto.setProtein(diet.getProtein());
        dto.setCarbs(diet.getCarbs());
        dto.setFat(diet.getFat());
        dto.setFibre(diet.getFibre());
        dto.setMealDate(diet.getMealDate());

        dto.setUserId(diet.getUserId());

        return dto;
    }
}